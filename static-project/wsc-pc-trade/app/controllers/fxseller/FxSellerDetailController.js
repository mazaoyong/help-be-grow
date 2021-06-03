const BaseController = require('../base/BaseController');
const PurchaseOrderService = require('../../services/fx/PurchaseOrderService');

class FxSellerDetailController extends BaseController {
  async index(ctx) {
    // 分销相关业务已从pc-trade迁出至pc-fenxiao
    super.redirectToNewestUrl(this.ctx);
    await ctx.render('fxseller/detail.html');
  }

  async getDetail(ctx) {
    const orderNo = ctx.getQueryData('orderNo');
    const result = await new PurchaseOrderService(ctx).getDetailByFxOrder({
      fxKdtId: ctx.kdtId,
      fxOrderNo: orderNo,
    });
    ctx.json(0, 'success', result);
  }
}

module.exports = FxSellerDetailController;
