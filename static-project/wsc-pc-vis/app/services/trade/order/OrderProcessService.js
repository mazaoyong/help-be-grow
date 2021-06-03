const BaseService = require('../../base/BaseService');
/* com.youzan.ebiz.mall.trade.seller.api.service.order.OrderProcessService -  */
class OrderProcessService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.order.OrderProcessService';
  }

  /**
   *  取消订单(合并支付订单将被同时取消)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281112
   *
   *  @param {Object} request -
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {boolean} request.fromOpen - 是否来自open调用
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.cancelReason - 取消原因
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async cancelOrder(request) {
    return this.invoke('cancelOrder', [request]);
  }
}

module.exports = OrderProcessService;
