const BaseService = require('./BasePaymentService');
const createPayGatewayService = require('@youzan/pay-gateway-plugin').default;

/**
 * 店铺认证相关
 */
class CertInfoService extends BaseService {
  /**
   * 主体认证状态
   */
  static get CertStatus() {
    return {
      Pass: 4,
      Reject: 5,
      Invalid: 99,
    };
  }

  get SERVICE_NAME() {
    return 'com.youzan.pay.customer.api.cert.MerchantCertInfoService';
  }

  /**
   *  Owner:任邦-查询跨境电商认证状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/321218
   *
   *  @param {number} kdtId
   *  @return {Promise}
   */
  async queryCbcCertState(kdtId) {
    return this.payInvoke({
      service: 'youzan.pay.cert.certInfoService',
      method: 'queryCbcCertState',
      version: '1.0.0',
      data: {
        kdtId,
      },
    });
  }
}

module.exports = createPayGatewayService(CertInfoService);
