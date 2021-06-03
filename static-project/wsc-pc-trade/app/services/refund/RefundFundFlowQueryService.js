const BaseService = require('../base/BaseService');

/**
 * 查询退款资金流向
 */
class RefundFundFlowQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.refund.RefundFundFlowQueryService';
  }

  /**
   *  查询退款资金流向
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/892112
   *
   *  @param {Object} request - 入参
   *  @param {string} request.orderNo - 退款资金流水号
   *  @param {string} request.refundNo - 退款单号
   *  @param {string} request.refundId - 订单号
   *  @return {Promise}
   */
  async queryRefundFund(request) {
    return this.invoke('queryRefundFund', [request]);
  }
}

module.exports = RefundFundFlowQueryService;
