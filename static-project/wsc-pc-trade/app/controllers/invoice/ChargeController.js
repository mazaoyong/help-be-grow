const BaseController = require('./InvoiceBaseController');
const MarketRemoteService = require('../../services/yop/MarketRemoteService');

/**
 * 电子发票充值
 */
class ChargeController extends BaseController {
  get marketRemoteService() {
    return this.getCacheService(MarketRemoteService);
  }

  /**
   * 获取充值列表
   * @param {AstroboyContext} ctx
   */
  async chargeList(ctx) {
    const query = ctx.getQueryData();
    const { kdtId } = ctx;
    const result = await this.marketRemoteService.listOrderV2({ ...query, kdtId });
    return ctx.successRes(result);
  }
}

module.exports = ChargeController;
