const URL = require('@youzan/wsc-pc-base/app/lib/URL');
const BaseController = require('../base/BaseController');
const ColumnService = require('../../services/owl/ic/ColumnService');
const ColumnFacadeService = require('../../services/owl/api/v2/column/ColumnFacade');
const OnlineCourseColumnFacade = require('../../services/owl/pc/onlinecourse/ColumnFacade');
const ContentFacade = require('../../services/api/owl/pc/ContentFacade');
const CourseContentFacade = require('../../services/owl/pc/course/ContentFacade');
const ColumnFacade = require('../../services/api/owl/pc/ColumnFacade');
const DirectoryFacade = require('../../services/owl/pc/onlinecourse/DirectoryFacade');
const ContentFacadeV2 = require('../../services/owl/pc/onlinecourse/ContentFacade');
const { includes, camelCase } = require('lodash');

const runtime = global.getRuntime();
const apolloClient = runtime.apolloClient;

class ColumnController extends BaseController {
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

      await this.ctx.getAbilitiesByMultiNamespaceV2(
        this.ctx,
        [{ businessName: 'edu', namespaceName: '知识付费', abilityKey: ['dirManage'] }],
        { shopInfo: this.ctx.getState('shopInfo') }
      );
    }
  }

  async redirectToNewUrl(ctx) {
    await ctx.redirect(URL.site('/vis/course/column/list', 'v4'));
  }

  async getIndexHtml(ctx) {
    await ctx.render('course/column/index.html');
  }

  async getEditHtml(ctx) {
    const { alias } = ctx.params;
    ctx.setState('navTitle', /add$/.test(ctx.request.path) ? '新建专栏' : '编辑专栏');
    ctx.setGlobal('alias', alias);
    await ctx.render('course/column/edit.html');
  }

  async getContentHtml(ctx) {
    const { alias } = ctx.params;
    ctx.setGlobal('alias', alias);

    try {
      // apollo 配置 小程序版本号
      const apolloResult = apolloClient.getConfig({
        appId: 'owl-ic-chain',
        namespace: 'application',
      });
      ctx.setGlobal({ kdtWhiteListConfig: apolloResult.kdtWhiteList });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(('获取apollo配置出错', err));
    }

    await ctx.render('course/column/manage.html');
  }

  async getDetailHtml(ctx) {
    const { alias } = ctx.params;
    ctx.setGlobal('alias', alias);
    await ctx.render('course/column/detail.html');
  }

  async getRecordHtml(ctx) {
    const { alias } = ctx.params;
    ctx.setGlobal('alias', alias);
    await ctx.render('course/column/record.html');
  }

  /**
   * # Iron migrate start #
  */

  // 修改专栏更新状态
  async updateSerializedStatus(ctx) {
    const { alias, isStop } = ctx.request.body || {};

    const res = await new OnlineCourseColumnFacade(ctx).updateSerializedStatus(
      ctx.kdtId, {
        alias, isStop, operator: this.formatOperator,
      }
    );
    return ctx.json(0, 'ok', res);
  }

  // 修改专栏上架状态
  async updateOnSaleStatus(ctx) {
    const { alias, isOnSale } = ctx.request.body || {};

    const res = await new OnlineCourseColumnFacade(ctx).updateOnSaleStatus(
      ctx.kdtId, {
        alias, isOnSale, operator: this.formatOperator,
      }
    );
    return ctx.json(0, 'ok', res);
  }

  // 创建专栏
  async createColumn(ctx) {
    let data = ctx.request.body || {};
    data = {
      ...data, operator: this.formatOperator,
    };
    data = await ctx.visXss(data, 'previewContent');
    // 降级处理：https://jira.qima-inc.com/browse/CSWT-37023
    try {
      const res = await new OnlineCourseColumnFacade(ctx).createColumn(ctx.kdtId, data);
      return ctx.json(0, 'ok', res);
    } catch (error) {
      ctx.visLogger.warn('[createColumn error]', error);
      if (includes(error.msg, 'Internal Error')) {
        return ctx.json(10099, '发生了未知问题，课程可能没有创建成功，可重试', error);
      }
      throw error;
    }
  }

  // 修改专栏
  async updateColumn(ctx) {
    let data = ctx.request.body || {};
    data = {
      ...data, operator: this.formatOperator,
    };
    data = await ctx.visXss(data, 'previewContent');
    const res = await new OnlineCourseColumnFacade(ctx).updateColumn(ctx.kdtId, data);
    return ctx.json(0, 'ok', res);
  }

  // 更新专栏排序值
  async updateSerialNo(ctx) {
    const { alias, serialNo } = ctx.request.body || {};
    const res = await new OnlineCourseColumnFacade(ctx).updateSerialNo(ctx.kdtId, {
      alias, operator: this.formatOperator, serialNo,
    });
    return ctx.json(0, 'ok', res);
  }

  // 删除专栏
  async deleteColumn(ctx) {
    const { alias } = ctx.request.body || {};
    const res = await new OnlineCourseColumnFacade(ctx).deleteColumn(ctx.kdtId, {
      alias, operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  // 复制专栏
  async copy(ctx) {
    const { alias } = ctx.request.body || {};
    const res = await new OnlineCourseColumnFacade(ctx).copy(ctx.kdtId, alias);
    return ctx.json(0, 'ok', res);
  }

  // 获取专栏详情
  async getByAlias(ctx) {
    const { alias } = ctx.request.query || {};
    const res = await new OnlineCourseColumnFacade(ctx).getByAlias(ctx.kdtId, alias);
    return ctx.json(0, 'ok', res);
  }

  // 按照条件查询相关的专栏商品
  async findPageByCondition(ctx) {
    const { pcColumnQuery = {}, pageRequest = {} } = ctx.getQueryParse() || {};
    const res = await new OnlineCourseColumnFacade(ctx)
      .findPageByCondition(ctx.kdtId, pcColumnQuery, pageRequest);
    return ctx.json(0, 'ok', res);
  }

  // 微页面用
  async findPageByConditionNew(ctx) {
    const { kdtId, query } = ctx;
    const {
      title,
      status,
      p,
      page_size: pageSize,
      order,
      order_by: orderBy,
    } = query || {};
    const pcColumnSearchCommand = {
      status: +status || 1,
    };
    if (title) {
      pcColumnSearchCommand.title = title;
    }
    const pageRequest = {
      countEnabled: true,
      pageNumber: +p || 1,
      pageSize: +pageSize || 10,
      sort: {
        orders: [],
      },
    };
    if (order && orderBy) {
      pageRequest.sort.orders.push({
        direction: order.toUpperCase(),
        property: orderBy,
      });
    }
    const result = await new OnlineCourseColumnFacade(ctx).findPageByCondition(
      kdtId,
      pcColumnSearchCommand,
      pageRequest
    );
    return ctx.json(0, 'ok', {
      list: result.content,
      total: result.total,
    });
  }

  // 更新专栏请好友看状态
  async updateShareStatus(ctx) {
    const { alias, everyFriendContentCount, everyContentFriendCount, isShared } =
      ctx.request.body || {};
    const res = await new OnlineCourseColumnFacade(ctx).updateShareStatus(
      ctx.kdtId, {
        alias, everyFriendContentCount, everyContentFriendCount, isShared, operator: this.formatOperator,
      }
    );
    return ctx.json(0, 'ok', res);
  }

  // 更新专栏显示/隐藏状态
  async updateShowOrHideStatus(ctx) {
    const { alias } = ctx.request.body || {};
    const res = await new OnlineCourseColumnFacade(ctx).updateShowOrHideStatus(
      ctx.kdtId, {
        alias, operator: this.formatOperator,
      }
    );
    return ctx.json(0, 'ok', res);
  }

  /**
   * # Iron migrate end #
  */

  // 根据别名查询专栏基本信息
  async getBaseJson(ctx) {
    const kdtId = ctx.kdtId;
    const { alias } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdtId 不能为空');
    this.validator.required(alias, '专栏别名 alias 不能为空');

    const res = await new ColumnService(ctx).getColumnDTOByAlias(kdtId, alias);

    return ctx.json(0, 'ok', res);
  }

  async putDuplicateColumn(ctx) {
    const { kdtId = '', request } = ctx;
    const {
      body: { alias },
    } = request;

    const data = await new ColumnFacadeService(ctx).putDuplicateColumn(kdtId, alias);

    return ctx.json(0, 'ok', data);
  }

  async quickUpdateColumnByAlias(ctx) {
    const { kdtId = '', request } = ctx;
    const {
      body: { columnQuickUpdateCommand },
    } = request;

    const operator = this.formatOperator;
    columnQuickUpdateCommand.operator = operator;
    const data = await new OnlineCourseColumnFacade(ctx).quickUpdateColumnByAlias(kdtId, columnQuickUpdateCommand);

    return ctx.json(0, 'ok', data);
  }

  // 获取专栏内容列表
  async getContentsAndLives(ctx) {
    const { kdtId } = ctx;
    const { columnAlias, order = 'DESC', orderBy, pageNumber, pageSize, subSortBy, directoryId, status, keyWord, onlySort } = ctx.getQueryParse() || {};

    const direction = order.toUpperCase();
    const query = {
      kdtId,
      columnAlias,
      directoryId,
      status,
      keyWord,
    };

    let sort = onlySort ? {
      orders: [
        { direction, property: camelCase(onlySort) },
      ],
    } : {
      orders: [
        { direction, property: camelCase(orderBy) },
        { direction, property: camelCase(subSortBy) },
      ],
    };
    if (!directoryId || directoryId === '0') {
      delete query.directoryId;
      sort = null;
    }
    if (!keyWord) {
      delete query.keyWord;
    }
    const pageRequest = {
      pageNumber,
      pageSize,
      sort,
    };

    const result = await new ContentFacade(ctx).findPageContentWithLive(kdtId, query, pageRequest);
    ctx.json(0, 'ok', result);
  }

  // 更新内容免费试读状态
  async postContentFree(ctx) {
    const { kdtId } = ctx;
    const { freeStatus, alias } = ctx.request.body;

    const pcFreeStatusUpdateCommand = {
      alias,
      freeStatus,
      operator: this.operator,
    };

    const result = await new ContentFacade(ctx).updateFreeStatus(kdtId, pcFreeStatusUpdateCommand);
    ctx.json(0, 'ok', result);
  }

  // 更新专栏内容排序值
  async putContentSort(ctx) {
    const { kdtId } = ctx;
    const {
      alias,
      channel,
      serialNo,
    } = ctx.request.body;

    const pcSerialNoCommand = {
      alias,
      owlType: channel,
      serialNo,
      operator: this.operator,
    };

    const result = await new ColumnFacade(ctx).updateContentSerialNo(kdtId, pcSerialNoCommand);
    ctx.json(0, 'ok', result);
  }

  // 添加内容
  async putContent(ctx) {
    const { kdtId } = ctx;
    const { addedContentDTOS, columnAlias, directoryId } = ctx.request.body;
    const addContentCommand = {
      addedContentDTOS,
      columnAlias,
      directoryId,
      operator: this.operator,
    };

    const result = await new ColumnFacade(ctx).batchAddContent2Column(kdtId, addContentCommand);
    ctx.json(0, 'ok', result);
  }

  // 获取专栏订阅数
  async getColumnSubscriptionCount(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new OnlineCourseColumnFacade(ctx).getColumnSubscriptionCount(kdtId, alias);
    return ctx.json(0, 'ok', result);
  }

  // migrate from owlcolumncontroller
  async courseNotice(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new OnlineCourseColumnFacade(ctx).courseNotice(kdtId, req);
    return ctx.json(0, 'ok', res);
  }

  // B端专栏列表（分销专栏下的感叹号），忽略分销专栏的一个异常
  async updateOverLookSingleColumn(ctx) {
    const { kdtId = 0 } = ctx;
    const { alias, overlookState, overlookPrice } = ctx.getPostData();
    const sellerColumnUpdateDTO = {
      alias,
      overlookState,
      overlookPrice,
    };
    const res = await new OnlineCourseColumnFacade(ctx).updateOverLookSingleColumn(
      kdtId,
      sellerColumnUpdateDTO
    );
    return ctx.json(0, 'ok', res);
  }

  // 知识付费->专栏列表->忽略该消息
  async updateOverLookAllColumns(ctx) {
    const { kdtId = 0 } = ctx;
    const res = await new OnlineCourseColumnFacade(ctx).updateOverLookAllColumns(kdtId);
    return ctx.json(0, 'ok', res);
  }

  // 知识付费->统计有异常信息的专栏的数量
  async getColumnWarningCount(ctx) {
    const { kdtId = 0 } = ctx;
    const res = await new OnlineCourseColumnFacade(ctx).getColumnWarningCount(kdtId);
    return ctx.json(0, 'ok', res);
  }

  // 创建专栏目录
  async createDirectory(ctx) {
    const { kdtId } = ctx;
    const { createDirectoryDTO } = ctx.request.body || {};
    const res = await new DirectoryFacade(ctx).create(kdtId, createDirectoryDTO);
    return ctx.json(0, 'ok', res);
  }

  // 更新专栏目录
  async updateDirectory(ctx) {
    const { kdtId } = ctx;
    const { updateDTO } = ctx.request.body || {};
    const res = await new DirectoryFacade(ctx).update(kdtId, updateDTO);
    return ctx.json(0, 'ok', res);
  }

  // 目录移动内容
  async directoryMoveContent(ctx) {
    const { kdtId } = ctx;
    const { moveContentDTO } = ctx.request.body || {};
    const res = await new DirectoryFacade(ctx).directoryMoveContent(kdtId, moveContentDTO);
    return ctx.json(0, 'ok', res);
  }

  // 目录移动
  async moveDirectory(ctx) {
    const { kdtId } = ctx;
    const { moveDTO } = ctx.request.body || {};
    const res = await new DirectoryFacade(ctx).move(kdtId, moveDTO);
    return ctx.json(0, 'ok', res);
  }

  // 目录删除
  async deleteDirectory(ctx) {
    const { kdtId } = ctx;
    const { deleteDTO } = ctx.request.body || {};
    const res = await new DirectoryFacade(ctx).delete(kdtId, deleteDTO);
    return ctx.json(0, 'ok', res);
  }

  // 查询目录树
  async queryDirectoryList(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, queryDTO } = ctx.getQueryParse() || {};
    const res = await new DirectoryFacade(ctx).queryDirectoryList(kdtId, pageRequest, queryDTO);
    return ctx.json(0, 'ok', res);
  }

  // 批量删除内容
  async batchDeleteContent(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.request.body || {};
    const params = {
      ...command,
      operator: this.formatOperator,
    };

    const res = await new ContentFacadeV2(ctx).batchDeleteContent(kdtId, params);
    return ctx.json(0, 'ok', res);
  }

  // 专栏添加内容
  async directoryAddContent(ctx) {
    const { kdtId } = ctx;
    const { contentList, id, columnAlias } = ctx.request.body || {};
    const params = {
      contentList,
      id,
      columnAlias,
    };

    const res = await new DirectoryFacade(ctx).directoryAddContent(kdtId, params);
    return ctx.json(0, 'ok', res);
  }

  // 批量查询订阅
  async findContentSubscriptionCountList(ctx) {
    const { kdtId } = ctx;
    const { aliases } = ctx.getQueryParse() || {};

    const res = await new CourseContentFacade(ctx).findContentSubscriptionCountList(kdtId, aliases);
    return ctx.json(0, 'ok', res);
  }
}

module.exports = ColumnController;
