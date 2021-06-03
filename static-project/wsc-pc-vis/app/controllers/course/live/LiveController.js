const URL = require('@youzan/wsc-pc-base/app/lib/URL');
const BaseController = require('../../base/BaseController');
const OnlineCourseLiveFacade = require('../../../services/owl/pc/onlinecourse/LiveFacade');
const LiveVideoFacade = require('../../../services/api/owl/pc/LiveVideoFacade');
const GoodsSelectorConfigService = require('../../../services/ump/manage/GoodsSelectorConfigService');
const EduLiveVideoFacade = require('../../../services/api/owl/pc/EduLiveVideoFacade');
const LiveLotteryFacade = require('../../../services/api/owl/pc/LiveLotteryFacade');

class LiveController extends BaseController {
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

  async redirectToNewUrl(ctx) {
    await ctx.redirect(URL.site('/vis/course/live/list', 'v4'));
  }

  async getIndexHtml(ctx) {
    await this._setPolyvAuth(ctx).catch(() => { });
    if (!ctx.isYZEdu) {
      await ctx.redirect(URL.site('/vis/pct/page/tabs#/live', 'v4'));
    }
    await ctx.render('course/live/index.html');
  }

  async getEditHtml(ctx) {
    const { alias } = ctx.params;
    ctx.setState('navTitle', /add/.test(ctx.request.path) ? '新建直播' : '编辑直播');
    ctx.setGlobal('alias', alias);
    await ctx.render('course/live/edit.html');
  }

  async getPolyvHtml(ctx) {
    await ctx.render('course/live/polyv.html');
  }

  /**
   * # Iron migrate start #
   */

  // 创建直播商品
  async createLive(ctx) {
    let data = ctx.request.body || {};
    data = {
      ...data,
      operator: this.formatOperator,
    };
    data = await ctx.visXss(data, 'detail');
    const res = await new OnlineCourseLiveFacade(ctx).createLive(ctx.kdtId, data);
    return ctx.json(0, 'ok', res);
  }

  // 更新直播商品
  async updateLive(ctx) {
    let data = ctx.request.body || {};
    data = {
      ...data,
      operator: this.formatOperator,
    };
    data = await ctx.visXss(data, 'detail');
    const res = await new OnlineCourseLiveFacade(ctx).updateLive(ctx.kdtId, data);
    return ctx.json(0, 'ok', res);
  }

  // 获取直播商详
  async getByAlias(ctx) {
    const { alias } = ctx.request.query || {};
    const res = await new OnlineCourseLiveFacade(ctx).getByAlias(ctx.kdtId, alias);
    return ctx.json(0, 'ok', res);
  }

  // pc端分页查询直播列表
  async findPageByCondition(ctx) {
    const { query = {}, pageRequest = {}, targetKdtId } = ctx.getQueryParse() || {};
    query.targetKdtId = targetKdtId;
    const res = await new OnlineCourseLiveFacade(ctx)
      .findPageByCondition(ctx.kdtId, query, pageRequest);
    return ctx.json(0, 'ok', res);
  }

  // 微页面选择直播弹框
  async findPageByConditionWym(ctx) {
    const { kdtId, query } = ctx;
    const {
      title,
      page,
      page_size: pageSize,
    } = query || {};
    // http://zanapi.qima-inc.com/site/service/view/471553
    const pcLiveSearchCommand = {
      showInStore: 1, // 店铺中是否显示 1：是 0：否
      sellStatus: 1, // 售卖状态 0: 全部 1：上架 2：下架
    };
    if (title) {
      pcLiveSearchCommand.title = title;
    }
    const pageRequest = {
      pageNumber: +page || 1,
      pageSize: +pageSize || 10,
      sort: {
        orders: [{
          direction: 'DESC',
          property: 'serial_no',
        }, {
          direction: 'DESC',
          property: 'created_at',
        }
        ],
      },
    };
    const result = await new OnlineCourseLiveFacade(ctx).findPageByCondition(
      kdtId,
      pcLiveSearchCommand,
      pageRequest
    );
    return ctx.json(0, 'ok', {
      list: result.content,
      total: result.total,
    });
  }

  // 删除直播商品
  async deleteLive(ctx) {
    const { alias, deleteChannel } = ctx.request.body || {};
    const res = await new OnlineCourseLiveFacade(ctx).deleteLive(ctx.kdtId, {
      alias,
      deleteChannel,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  // 更新直播排序值
  async updateSerialNo(ctx) {
    const { alias, serialNo } = ctx.request.body || {};
    const res = await new OnlineCourseLiveFacade(ctx).updateSerialNo(ctx.kdtId, {
      alias,
      operator: this.formatOperator,
      serialNo,
    });
    return ctx.json(0, 'ok', res);
  }

  // 更新直播显示/隐藏状态
  async updateShowOrHideStatus(ctx) {
    const { alias } = ctx.request.body || {};
    const res = await new OnlineCourseLiveFacade(ctx).updateShowOrHideStatus(ctx.kdtId, {
      alias,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  // 直播设置免费
  async updateFreeLive(ctx) {
    const { alias } = ctx.request.body || {};
    const res = await new OnlineCourseLiveFacade(ctx).updateFreeLive(ctx.kdtId, {
      alias,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  // 结束直播
  async updateCloseLive(ctx) {
    const { alias } = ctx.request.body || {};
    const res = await new OnlineCourseLiveFacade(ctx).updateCloseLive(ctx.kdtId, {
      alias,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  // 获取直播管理员邀请码
  async getLiveInviteAdminCode(ctx) {
    const { alias } = ctx.request.query || {};
    const res = await new OnlineCourseLiveFacade(ctx).getLiveInviteAdminCode(ctx.kdtId, {
      alias,
      operator: this.formatOperator,
    });
    return ctx.json(0, 'ok', res);
  }

  /**
   * # Iron migrate end #
   */

  async quickUpdateLiveByAlias(ctx) {
    const { kdtId = '', request } = ctx;
    const {
      body: { liveQuickUpdateCommand },
    } = request;

    const operator = this.formatOperator;
    liveQuickUpdateCommand.operator = operator;
    const data = await new OnlineCourseLiveFacade(ctx).quickUpdateLiveByAlias(
      kdtId,
      liveQuickUpdateCommand,
    );

    return ctx.json(0, 'ok', data);
  }

  async getLiveSubscriptionCount(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new OnlineCourseLiveFacade(ctx).getLiveSubscriptionCount(kdtId, alias);
    ctx.json(0, 'ok', result);
  }

  // 检查保利威是否授权，未授权不再展示保利威入口
  async _setPolyvAuth(ctx) {
    const { kdtId } = ctx;
    const result = await new LiveVideoFacade(ctx).polyvCheck(kdtId);
    if (!result.checked && result.failCode === 1) {
      return ctx.setGlobal('showPolvy', false);
    }
    ctx.setGlobal('showPolvy', true);
  }

  /**************************************/
  /*            直播间管理API             */
  /**************************************/

  async getLiveManageHtml(ctx) {
    // 获取商品选择器配置
    const gsConfig = await new GoodsSelectorConfigService(ctx).queryGoodsSelectorConfig({
      shopId: ctx.kdtId,
      domain: 'UMP',
      umpType: 10100,
    });
    ctx.setGlobal('gsConfig', gsConfig);
    await ctx.render('course/live/live-manage.html');
  }

  async livePlayBackList(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).livePlayBackList(kdtId, alias);

    ctx.json(0, 'ok', result);
  }

  async playBackOrder(ctx) {
    const { kdtId } = ctx;
    const { alias, newOrders } = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).playBackOrder(kdtId, {
      alias,
      vids: newOrders,
    });

    ctx.json(0, 'ok', result);
  }

  async deletePlayBackLive(ctx) {
    const { kdtId } = ctx;
    const { alias, vid, fileId } = ctx.getPostData();
    const operator = this.formatOperator;
    const result = await new EduLiveVideoFacade(ctx).deletePlayBackLive(
      kdtId,
      Object.assign({ alias, vid, fileId }, operator),
    );

    ctx.json(0, 'ok', result);
  }

  async getLiveSetting(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).getLiveSetting(kdtId, alias);

    ctx.json(0, 'ok', result);
  }

  async updateLiveSetting(ctx) {
    const { kdtId } = ctx;
    const { alias, liveSetting } = ctx.getPostData();
    const liveSettingCommand = {
      alias,
      ...liveSetting,
    };
    const result = await new EduLiveVideoFacade(ctx).liveSetting(
      kdtId,
      Object.assign({}, liveSettingCommand, {
        operator: this.formatOperator,
      }),
    );

    ctx.json(0, 'ok', result);
  }

  async getLiveFlowDetail(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.getQueryParse();
    const result = await new EduLiveVideoFacade(ctx).getLiveFlowDetail(kdtId, { alias });

    ctx.json(0, 'ok', result);
  }

  async updateTeacher(ctx) {
    const { kdtId } = ctx;
    const params = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).updateTeacher(
      kdtId,
      Object.assign({}, params, { operator: this.formatOperator }),
    );

    ctx.json(0, 'ok', result);
  }

  async operatorPlaybackWithStatus(ctx) {
    const { kdtId } = ctx;
    const params = ctx.getPostData();
    const result = await new EduLiveVideoFacade(ctx).operatorPlaybackWithStatus(
      kdtId,
      Object.assign({}, params, { operator: this.formatOperator }),
    );

    ctx.json(0, 'ok', result);
  }

  // 分页查询直播间的抽奖记录
  async findWinLotteryPage(ctx) {
    const { kdtId } = ctx;
    const params = ctx.getQueryParse() || {};
    const { query, pageRequest } = params;
    const result = await new LiveLotteryFacade(ctx).findWinLotteryPage(kdtId, pageRequest, query);

    ctx.json(0, 'ok', result);
  }

  // 提交直播间中奖记录的导出任务
  async submitExportTask(ctx) {
    const { kdtId } = ctx;
    const data = ctx.request.body || {};
    const operator = this.formatOperator || {};
    const result = await new LiveLotteryFacade(ctx).submitExportTask(kdtId, { ...data, operator });

    ctx.json(0, 'ok', result);
  }
}

module.exports = LiveController;
