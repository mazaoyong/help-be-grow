const BaseService = require('./BasePaymentService');
const createPayGatewayService = require('@youzan/pay-gateway-plugin').default;

/**
 * IndexService
 */
class IndexService extends BaseService {
  /**
   *
   * @param {*} params
   */
  async balanceDaysIncome(params) {
    return this.payInvoke({
      service: 'youzan.pay.customer.api.assetv2.index.IndexService',
      method: 'balanceDaysIncome',
      version: '1.0.0',
      data: params,
    });
  }
}

module.exports = createPayGatewayService(IndexService);
