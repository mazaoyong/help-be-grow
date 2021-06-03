const BaseController = require('../base/BaseController');
const SameDaySettlementService = require('../../services/trade/business/settlement/SameDaySettlementService');

class IndexController extends BaseController {
  /**
   * 当日结算页面
   * @param {Context} ctx
   */
  async getIndexHtml(ctx) {
    await ctx.render('settlement/index.html');
  }

  /**
   * 查询当日结算加入状态
   * @param {Context} ctx
   */
  async queryApplyStatus(ctx) {
    const { kdtId } = ctx;
    const result = await new SameDaySettlementService(ctx).queryApplicationStatus({ kdtId });
    return ctx.successRes(result);
  }

  /**
   * 申请当日结算
   * @param {Context} ctx
   */
  async applyToJoin(ctx) {
    const { kdtId, userId: operateId } = ctx;

    const params = {
      kdtId,
      operateId,
    };

    const result = await new SameDaySettlementService(ctx).application(params);
    return ctx.successRes(result);
  }

  /**
   * 退出当日结算
   * @param {Context} ctx
   */
  async quit(ctx) {
    const { kdtId, userId: operateId } = ctx;

    const params = {
      kdtId,
      operateId,
    };

    const result = await new SameDaySettlementService(ctx).quit(params);
    return ctx.successRes(result);
  }
}

module.exports = IndexController;
