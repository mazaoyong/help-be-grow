const OrderBaseService = require('./OrderBaseService');

/**
 * 订单查询相关
 */
class OrderQueryService extends OrderBaseService {
  /**
   * OrderQueryService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.order.OrderQueryService';
  }

  /**
   *  查询订单发票列表
   *  @param {object} request
   */
  async listInvoice(request) {
    return this.invoke('listInvoice', [request]);
  }

  /**
   *  同城订单获取 语音提醒链接 待接单订单和配送异常订单的角标
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/291885
   *
   *  @param {number} kdtId
   *  @param {number} storeId
   *  @return {Promise}
   */
  async getOrderNumAndVoice(kdtId, storeId) {
    return this.invoke('getOrderNumAndVoice', [kdtId, storeId]);
  }

  /**
   *  获得拒单理由
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351328
   *
   *  @return {Promise}
   */
  async listRejectReasons() {
    return this.invoke('listRejectReasons');
  }

  /**
   *  获取订单详情，按老的订单详情页面数据给的
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/94546
   *
   *  @param {Object} request -
   *  @param {string} request.orderNo -
   *  @param {boolean} request.withRemark -
   *  @param {boolean} request.withSourceInfo -
   *  @param {number} request.kdtId -
   *  @param {boolean} request.withBuyerInfo -
   *  @param {boolean} request.withOrderAddressInfo -
   *  @param {boolean} request.withMainOrderInfo -
   *  @param {boolean} request.withChildInfo -
   *  @param {boolean} request.withPaymentInfo -
   *  @param {boolean} request.enableCache -
   *  @param {boolean} request.withItemInfo -
   *  @return {Promise}
   */
  async getOrderDetailFormat(request) {
    return this.invoke('getOrderDetailFormat', [request]);
  }

  /**
   *  查询订单详情（这个接口数据不全，不能用，格式是零售订单数据格式）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/94545
   *
   *  @param {Object} orderDetailDTO - 订单查询参数
   *  @param {string} orderDetailDTO.orderNo -
   *  @param {boolean} orderDetailDTO.withRemark -
   *  @param {boolean} orderDetailDTO.withSourceInfo -
   *  @param {number} orderDetailDTO.kdtId -
   *  @param {boolean} orderDetailDTO.withBuyerInfo -
   *  @param {boolean} orderDetailDTO.withOrderAddressInfo -
   *  @param {boolean} orderDetailDTO.withMainOrderInfo -
   *  @param {boolean} orderDetailDTO.withChildInfo -
   *  @param {boolean} orderDetailDTO.withPaymentInfo -
   *  @param {boolean} orderDetailDTO.enableCache -
   *  @param {boolean} orderDetailDTO.withItemInfo -
   *  @return {Promise}
   */
  async getOrderDetail(orderDetailDTO) {
    return this.invoke('getOrderDetail', [orderDetailDTO]);
  }
}

module.exports = OrderQueryService;
