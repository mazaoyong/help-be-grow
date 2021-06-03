const BaseService = require('./BasePaymentService');
const createPayGatewayService = require('@youzan/pay-gateway-plugin').default;

/**
 * youzan.pay.customercenter.contractsign
 */
class ContractSignService extends BaseService {
  /**
   *  提供签约服务 以后签约统一接入该接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/262569
   *
   *  @param {Object} data
   *  @return {Promise}
   */
  async sign(data) {
    return this.payInvoke({
      service: 'youzan.pay.customercenter.contractsign',
      method: 'sign',
      data: {
        pid: this.partnerId,
        ...data,
      },
    });
  }
}

module.exports = createPayGatewayService(ContractSignService);
