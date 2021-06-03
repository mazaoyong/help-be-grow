const BaseService = require('../../../base/BaseService');

/* com.youzan.trade.rp.api.query.RefundQueryService -  */
class RefundQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.rp.api.query.RefundQueryService';
  }

  /**
   *  查询指定退款金额在支付渠道上的分摊
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/497978
   *
   *  @param {string} orderNo - 订单号
   *  @param {number} refundFee - 退款金额
   *  @return {Promise}
   */
  async queryRefundPhasePriceInfo(orderNo, refundFee) {
    return this.invoke('queryRefundPhasePriceInfo', [orderNo, refundFee]);
  }
}

module.exports = RefundQueryService;
