const BaseController = require('../base/BaseController');
const ContentFacade = require('../../services/owl/pc/course/ContentFacade');
const ContentService = require('../../services/api/owl/pc/ContentFacade');
const camelCase = require('lodash/camelCase');

class ContentController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByMultiNamespace(this.ctx, [
        {
          namespaceId: 'course',
          businessId: 'wsc-pc-vis',
        },
        {
          namespaceId: 'shop',
          businessId: 'wsc-pc-shop',
        }
      ]);
    }
  }

  async getIndexHtml(ctx) {
    ctx.setGlobal('enable_video_hls', true); // 是否支持hls视频 全量开启

    await ctx.render('course/content/index.html');
  }

  // 获取内容订阅数
  async getContentSubscriptionCount(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new ContentFacade(ctx).getContentSubscriptionCount(kdtId, alias);
    ctx.json(0, 'ok', result);
  }

  // 获取内容列表
  async getContentList(ctx) {
    const { kdtId } = ctx;
    const {
      contentStatus = 0,
      groupId = null,
      mediaType = 0,
      sellerType = 0,
      title,
      pageSize,
      pageNumber,
      sortType = 'desc',
      sortBy = 'serialNo',
      subSortBy = 'publishAt',
    } = ctx.query;

    const direction = sortType.toUpperCase();
    const query = {
      contentStatus,
      groupId,
      kdtId,
      mediaType,
      sellerType,
      title,
    };
    const pageRequest = {
      pageNumber,
      pageSize,
      sort: {
        orders: [
          {
            direction,
            property: camelCase(sortBy),
          },
          {
            direction,
            property: camelCase(subSortBy),
          },
        ],
      },
    };

    const result = await new ContentService(ctx).findPageByCondition(kdtId, query, pageRequest);

    ctx.json(0, 'ok', result);
  }

  // 微页面选择内容弹框
  async findPageByConditionWym(ctx) {
    const { kdtId, query } = ctx;
    const { title, status, p, page_size: pageSize, order, order_by: orderBy } = query || {};
    // http://zanapi.qima-inc.com/site/service/view/499543
    const pcContentSearchCommand = {
      contentStatus: +status || 1, // 上下架状态 0: 全部 1:上架 对应 1 (1 上架) 2:下架 对应 2,3,4 (2 下架 3暂存 4定时上架)
      sellerType: 0, // 售卖方式 0:全部 1:单独售卖 2:专栏售卖 3:可单独售卖也可以专栏售卖
      showInStore: 1, // 店铺中是否显示 1：是 0：否
    };
    if (title) {
      pcContentSearchCommand.title = title;
    }
    const pageRequest = {
      pageNumber: +p || 1,
      pageSize: +pageSize || 10,
      sort: {
        orders: [],
      },
    };
    if (order && orderBy) {
      pageRequest.sort.orders.push({
        direction: order.toUpperCase(),
        property: camelCase(orderBy),
      });
    }
    const result = await new ContentService(ctx).findPageByCondition(
      kdtId,
      pcContentSearchCommand,
      pageRequest,
    );

    let { content = [] } = result || {};
    return ctx.json(0, 'ok', {
      list: content,
      total: result.total,
    });
  }

  // 获取内容详情
  async getContentDetail(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new ContentService(ctx).getByAlias(kdtId, alias);
    ctx.json(0, 'ok', result);
  }

  // 新建内容
  async postContentDetail(ctx) {
    const createContentCommand = ctx.request.body;
    const result = await this._saveContentDetail(ctx, createContentCommand, true);
    ctx.json(0, 'ok', result);
  }

  // 更新内容
  async putContentDetail(ctx) {
    const createContentCommand = ctx.request.body;
    const result = await this._saveContentDetail(ctx, createContentCommand, false);
    ctx.json(0, 'ok', result);
  }

  // 删除内容
  async deleteContentDetail(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.request.body;
    const pcDeleteCommand = {
      alias,
      operator: this.formatOperator,
    };
    const result = await new ContentService(ctx).deleteContent(kdtId, pcDeleteCommand);
    ctx.json(0, 'ok', result);
  }

  // 复制内容
  async putDuplicateContent(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.request.body;
    const command = {
      alias,
      operator: this.formatOperator,
    };
    const result = await new ContentService(ctx).copy(kdtId, command);
    ctx.json(0, 'ok', result);
  }

  // 上下架
  async postContentPublish(ctx) {
    const { kdtId } = ctx;
    const { alias, status } = ctx.request.body;

    const pcSellStatusUpdateCommand = {
      alias,
      operator: this.operator,
      sellStatus: status,
    };

    const result = await new ContentService(ctx).updateSellStatus(kdtId, pcSellStatusUpdateCommand);
    ctx.json(0, 'ok', result);
  }

  // 批量新建内容
  async postBatchContent(ctx) {
    const data = ctx.request.body || {};
    const { contentList } = data;
    let success = true;
    const list = contentList.map((item) =>
      this._saveContentDetail(ctx, item, true).catch((error) => {
        success = false;
        return {
          data: item,
          error,
        };
      }),
    );
    const result = await Promise.all(list);
    if (success) {
      ctx.json(0, 'ok', result);
    } else {
      ctx.json(10099, '部分创建成功', result);
    }
  }

  // 更新内容排序值
  async updateSerialNo(ctx) {
    const { kdtId } = ctx;
    const { alias, serialNo } = ctx.getPostData();
    const serialNoCommand = {
      alias,
      serialNo,
      operator: this.formatOperator,
    };
    const result = await new ContentService(ctx).updateSerialNo(kdtId, serialNoCommand);
    ctx.json(0, 'ok', result);
  }

  async quickUpdateContentByAlias(ctx) {
    const { kdtId = '', request } = ctx;
    const {
      body: { contentQuickUpdateCommand },
    } = request;

    const operator = this.formatOperator;
    contentQuickUpdateCommand.operator = operator;

    const data = await new ContentFacade(ctx).quickUpdateContentByAlias(
      kdtId,
      contentQuickUpdateCommand,
    );

    return ctx.json(0, 'ok', data);
  }

  // 新建和更新内容的内部逻辑
  async _saveContentDetail(ctx, createContentCommand, isCreate) {
    const { kdtId } = ctx;
    createContentCommand.operator = this.formatOperator;

    // html富文本过滤
    const { mediaType } = createContentCommand;
    const xssOptions = {
      1: ['textContentDTO.content', 'textContentDTO.preview'],
      2: ['audioContentDTO.audioText', 'audioContentDTO.audioPreviewText'],
      3: ['videoContentDTO.videoText', 'videoContentDTO.videoPreviewText'],
    };
    const xssOption = xssOptions[mediaType];
    if (xssOptions) {
      createContentCommand = await ctx.visXss(createContentCommand, xssOption);
    }

    const method = isCreate ? 'createContent' : 'updateContent';
    const result = await new ContentService(ctx)[method](kdtId, createContentCommand);
    return result;
  }
}

module.exports = ContentController;
