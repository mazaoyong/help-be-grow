const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 发货查询
 */
class DeliveryQueryService extends DeliveryBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.dc.api.service.query.DeliveryQueryService';
  }

  /**
   *  查询延迟收货操作明细
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/667368
   *
   *  @param {string} orderNo -
   *  @return {Promise}
   */
  async queryDelayReceiveDetailByOrderNo(orderNo) {
    return this.invoke('queryDelayReceiveDetailByOrderNo', [orderNo]);
  }
}

module.exports = DeliveryQueryService;
