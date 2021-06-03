const BaseController = require('../base/BaseController');
const ShopBaseReadService = require('../../services/shop/ShopBaseReadService');
const DepositService = require('../../services/pay/DepositService');

class DepositController extends BaseController {
  async getExpressDeposit(ctx) {
    const { kdtId } = ctx;
    const shopBaseReadService = new ShopBaseReadService(ctx);
    const depositService = new DepositService(ctx);
    const { paymentClientId } = await shopBaseReadService.getPaymentByKdtId(+kdtId);
    const result = await depositService.queryAccount(
      String(paymentClientId),
      DepositService.types.EXPRESS_SERVICE,
    );
    ctx.json(0, 'ok', result);
  }
}

module.exports = DepositController;
