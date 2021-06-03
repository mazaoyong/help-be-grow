const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 发货操作
 */
class DeliveryOperateService extends DeliveryBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.dc.api.service.operate.DeliveryOperateService';
  }

  /**
   *  延长收货
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/125573
   *
   *  @param {Object} orderDelayReceiveRequestDTO -
   *  @param {Object} orderDelayReceiveRequestDTO.extension - 扩展信息
   *  @param {string} orderDelayReceiveRequestDTO.orderNo - 订单号
   *  @param {number} orderDelayReceiveRequestDTO.kdtId - 店铺kdtId
   *  @param {string} orderDelayReceiveRequestDTO.requestId - 请求标识(长度为24位)
   *  @param {Object} orderDelayReceiveRequestDTO.source - 来源信息
   *  @param {Object} orderDelayReceiveRequestDTO.operator - 操作者信息
   *  @return {Promise}
   */
  async orderDelayReceive(orderDelayReceiveRequestDTO) {
    return this.invoke('orderDelayReceive', [orderDelayReceiveRequestDTO]);
  }
}

module.exports = DeliveryOperateService;
