const BaseService = require('./BasePaymentService');
const createPayGatewayService = require('@youzan/pay-gateway-plugin').default;

/**
 * 查询账户信息
 */
class UserInfoService extends BaseService {
  /**
   * 查询账号
   * @param {number} kdtId 店铺id
   */
  async queryUserNoByKdtId(kdtId) {
    return this.payInvoke({
      service: 'youzan.pay.merchant.user.userno',
      method: 'convert',
      data: {
        kdtId,
      },
    });
  }
}

module.exports = createPayGatewayService(UserInfoService);
