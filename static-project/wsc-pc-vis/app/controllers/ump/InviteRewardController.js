const BaseController = require('../base/BaseController');
const InviteRewardFacade = require('../../services/api/owl/pc/InviteRewardFacade');
const OwlCommonService = require('../../services/owl/biz/OwlCommonService');

const runtime = global.getRuntime();
const apolloClient = runtime.apolloClient;

class InviteRewardController extends BaseController {
  async init() {
    super.init();
    const shopInfo = this.ctx.getState('shopInfo');
    await this.ctx.getAbilitiesByMultiNamespaceV2(
      this.ctx,
      [
        { businessName: 'ump', namespaceName: '转介绍', abilityKey: [] },
        { businessName: 'shop', namespaceName: '连锁店铺', abilityKey: [] },
      ],
      { shopInfo },
    );
  }
  // 运营后台页
  async getIndexHtml(ctx) {
    await this.initVisPage(ctx).catch(e => console.error(e));

    try {
      // apollo 配置 小程序版本号
      const apolloResult = apolloClient.getConfig({
        appId: 'wsc-pc-vis',
        namespace: 'wsc-pc-vis.setting.inviteReward',
      });
      ctx.setGlobal({ inviteRewardConfig: apolloResult });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(('获取apollo配置出错', err));
    }
    await this.setPointsName();
    await ctx.render('ump/invite-reward/index.html');
  }

  // 创建教育转介绍活动
  async create(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.request.body || {};
    const data = await ctx.visXss(
      command,
      'introductionInfo.newStudentPageSetting.organizationDesc',
    );
    const res = await new InviteRewardFacade(ctx).create(kdtId, data);
    ctx.json(0, 'success', res);
  }

  // 校验时间范围内是否存在活动
  async checkTimeRange(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.request.body || {};
    const res = await new InviteRewardFacade(ctx).checkTimeRange(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 编辑教育转介绍活动
  async edit(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.request.body || {};
    const data = await ctx.visXss(
      command,
      'introductionInfo.newStudentPageSetting.organizationDesc',
    );
    const res = await new InviteRewardFacade(ctx).edit(kdtId, data);
    ctx.json(0, 'success', res);
  }

  // 转介绍活动列表查询
  async findByPage(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query } = ctx.getQueryParse() || {};
    const res = await new InviteRewardFacade(ctx).findByPage(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 转介绍活动详情查询
  async getDetail(ctx) {
    const { kdtId } = ctx;
    const { query } = ctx.getQueryParse() || {};
    const res = await new InviteRewardFacade(ctx).getDetail(kdtId, query);
    ctx.json(0, 'success', res);
  }

  // 失效教育转介绍活动
  async invalid(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.request.body || {};
    const res = await new InviteRewardFacade(ctx).invalid(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 删除教育转介绍活动
  async delete(ctx) {
    const { kdtId } = ctx;
    const { command = {} } = ctx.request.body || {};
    const res = await new InviteRewardFacade(ctx).delete(kdtId, command);
    ctx.json(0, 'success', res);
  }

  // 查询转介绍活动效果数据(活动维度)
  async findPromotionList(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query } = ctx.getQueryParse() || {};
    const res = await new InviteRewardFacade(ctx).findPromotionList(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 查询转介绍活动新学员效果数据
  async findNewStudentList(ctx) {
    const { kdtId } = ctx;
    const { pageRequest, query } = ctx.getQueryParse() || {};
    const res = await new InviteRewardFacade(ctx).findNewStudentList(kdtId, pageRequest, query);
    ctx.json(0, 'success', res);
  }

  // 获取h5二维码
  async createQrCode(ctx) {
    const params = ctx.query;
    const queryData = {
      width: 540,
      height: 540,
      isShortenUrl: false,
      errorCorrectionLevel: 1,
      ...params,
    };

    const result = await new OwlCommonService(ctx).createQrCode(queryData);
    ctx.json(0, 'ok', result);
  }

  // 导出新学员列表
  async exportNewStudentData(ctx) {
    const { kdtId } = ctx;
    const { query = {} } = ctx.request.body || {};
    const { nickName: operatorName, mobile: operatorMobile } = this.formatOperator;
    const params = {
      ...query,
      operatorName,
      operatorMobile,
    };
    const result = await new InviteRewardFacade(ctx).exportNewStudentData(kdtId, params);
    ctx.json(0, 'ok', result);
  }

  // 获取活动数据
  async getSummary(ctx) {
    const { kdtId, query } = ctx;
    const result = await new InviteRewardFacade(ctx).getSummary(kdtId, query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = InviteRewardController;
