const BaseService = require('./BasePaymentService');
const createPayGatewayService = require('@youzan/pay-gateway-plugin').default;

// 账户类型
// 10 - 余额账户
// 15 - 老储值卡账户
// 30 - E卡账户
// 50 - 礼品卡账户
// 51 - 新储值卡账户
// 52 - 有赞大号推广保证金
// 54 - 有赞担保保证金
// 55 - 供货商入驻保证金
// 56 - 新礼品卡账户
// 57 - 消费者保障保证金
// 58 - 快速回款保证金
// 60 - 收益账户
// 61 - 快递服务保证金
// 3002 - DSP营销账户
// 62 - 待清算账户
// 63 - 待结算账户

/**
 * 查询账户信息
 */
class AccountService extends BaseService {
  /**
   * 查询店铺余额
   *
   * @param {string} userNo      商户号
   * @param {number} acctType    账户类型
   */
  async queryBalance(userNo, acctType) {
    return this.payInvoke({
      service: 'youzan.pay.acctrans.account',
      method: 'get',
      data: {
        userNo,
        acctType,
      },
    });
  }
}

module.exports = createPayGatewayService(AccountService);
