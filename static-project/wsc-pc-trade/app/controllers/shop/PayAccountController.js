const BaseController = require('../base/BaseController');
const ShopBaseReadService = require('../../services/shop/ShopBaseReadService');
const PayAccountService = require('../../services/pay/AccountService');

class PayAccountController extends BaseController {
  async getAccountBalance(ctx) {
    const { kdtId } = ctx;
    const shopBaseReadService = new ShopBaseReadService(ctx);
    const payAccountService = new PayAccountService(ctx);
    const { paymentClientId } = await shopBaseReadService.getPaymentByKdtId(+kdtId);
    const result = await payAccountService.queryBalance(paymentClientId, 10);
    ctx.json(0, 'ok', result);
  }
}

module.exports = PayAccountController;
