const BaseController = require('../base/BaseController');
const RewardsService = require('../../services/owl/edu/rewards/RewardService');
const CouponService = require('../../services/ump/asset/CouponService');

class RewardsController extends BaseController {
  /**
   * 首页
   *
   * @param {Object} ctx
   * @returns
   */
  async getIndexHtml(ctx) {
    const kdtId = ctx.kdtId;

    // 店铺生命周期
    const lifecycle = await this.callService(
      'wsc-pc-base/shop.ProdReadService',
      'queryShopProds',
      kdtId,
    );
    ctx.setGlobal('lifecycle', lifecycle); // 店铺生命周期

    await ctx.render('ump/rewards/index.html');
  }

  // 获取线下课发放节点信息
  async getRewardRelationInfo(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.request.query;
    const result = await new RewardsService(ctx)
      .getCourseProductRewardRelationInfo(kdtId, query);
    return ctx.json(0, 'ok', result);
  }

  // 获取奖励活动列表
  async getRewardsList(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse();
    const result = await new RewardsService(ctx)
      .listRewardActivity(kdtId, query.pageRequest, query.rewardActivityQuery);
    return ctx.json(0, 'ok', result);
  }

  // 获取奖励领取列表
  async getRecordsList(ctx) {
    const kdtId = ctx.kdtId;
    const query = ctx.getQueryParse();
    const result = await new RewardsService(ctx)
      .listRewardRecord(kdtId, query.pageRequest, query.rewardRecordQuery);
    return ctx.json(0, 'ok', result);
  }

  // 更新奖励活动状态
  async updateRewardStatus(ctx) {
    const { kdtId, request } = ctx;
    const { rewardActivityStatusUpdateCommand } = request.body;
    const result = await new RewardsService(ctx).updateRewardActivityStatus(kdtId, rewardActivityStatusUpdateCommand);
    return ctx.json(0, 'ok', result);
  }

  // 创建新的奖励活动
  async createRewardActivity(ctx) {
    const { kdtId, request } = ctx;
    const { rewardActivityCreateCommand } = request.body;
    const result = await new RewardsService(ctx).createRewardActivity(kdtId, rewardActivityCreateCommand);
    return ctx.json(0, 'ok', result);
  }

    // 更新奖励活动
    async updateRewardActivity(ctx) {
      const { kdtId, request } = ctx;
      const { rewardActivityCreateCommand } = request.body;
      const result = await new RewardsService(ctx).updateRewardActivity(kdtId, rewardActivityCreateCommand);
      return ctx.json(0, 'ok', result);
    }

  // 获取优惠券列表
  async getCoupons(ctx) {
    const { kdtId } = ctx;
    const query = ctx.getQueryParse();
    query.kdtId = kdtId;

    const result = await new CouponService(ctx).searchList4CouponComponent(query);
    return ctx.json(0, 'ok', result);
  }

  async getRewardActivity(ctx) {
    const { kdtId } = ctx;
    const { id, campusKdtId } = ctx.request.query;

    const result = await new RewardsService(ctx).getRewardActivity(kdtId, {
      rewardActivityId: id,
      targetKdtId: campusKdtId,
    });
    return ctx.json(0, 'ok', result);
  }

  // 导出奖励记录
  async submitExportRewardRecordTask(ctx) {
    const { kdtId, request } = ctx;
    const { exportQuery = {} } = request.body;
    const query = {
      ...exportQuery,
      operator: this.formatOperator,
    };
    const result = await new RewardsService(ctx).submitExportRewardRecordTask(kdtId, query);
    return ctx.json(0, 'ok', result);
  }
};

module.exports = RewardsController;
