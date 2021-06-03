const BaseService = require('./BasePaymentService');
const createPayGatewayService = require('@youzan/pay-gateway-plugin').default;

/**
 * 保证金相关
 */
class DepositService extends BaseService {
  /**
   * 保证金类型
   *
   * @readonly
   * @static
   * @memberof DepositService
   */
  static get types() {
    return {
      GOODS_SUPPLIER: 1, // 供货商入驻保证金
      XB_PLAN: 4, // 消费者保障保证金
      YZDH: 5, // 有赞大号推广保证金
      YZ_GUARANTEE: 6, // 有赞担保保证金
      QUICK_SETTLE: 7, // 快速回款保证金
      EXPRESS_SERVICE: 8, // 快递服务保证金
      CYCLE_PURCHASE: 9, // 周期购回款保证金
      CROSS_BORDER: 10, // 跨境电商保证金
    };
  }

  /**
   * 充值方式
   */
  static get rechargeMethod() {
    return {
      BALANCE: 3, // 余额转账到保证金
      QRCODE: 4, // 扫码充值
    };
  }

  /**
   * 查询保证金信息
   * zanapi文档地址: http://zanapi.qima-inc.com/site/service/view/282470
   *
   * @param {string} userNo          商户号
   * @param {number} depositType     保证金类型
   * @return {Promise}
   */
  async queryAccount(userNo, depositType) {
    return this.payInvoke({
      service: 'youzan.pay.deposit.account.query',
      method: 'queryaccount',
      data: {
        userNo,
        depositType,
      },
    });
  }

  /**
   * @typedef IJoinRes
   * @prop {string} qrUrl 扫码支付url
   * @prop {string} waterNo 流水号
   * @prop {string} rechargeNo 充值单号
   */

  /**
   * 缴纳保证金
   * https://doc.qima-inc.com/pages/viewpage.action?pageId=26429007
   *
   * @param {*} data
   * @return {Promise<IJoinRes>}
   */
  async join(data) {
    return this.payInvoke({
      service: 'youzan.pay.deposit.account',
      method: 'join',
      data: {
        serverUserNo: this.partnerId,
        ...data,
      },
    });
  }
}

module.exports = createPayGatewayService(DepositService);
