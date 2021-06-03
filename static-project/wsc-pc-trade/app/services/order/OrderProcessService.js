const OrderBaseService = require('./OrderBaseService');

/**
 * 订单操作相关
 */
class OrderProcessService extends OrderBaseService {
  /**
   * OrderProcessService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.order.OrderProcessService';
  }
  /**
   * 电子卡券订单出票
   * @param {string} orderNo
   */
  async ticket(orderNo) {
    return this.invoke('ticket', [orderNo]);
  }

  /**
   *  取消订单(合并支付订单将被同时取消)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281112
   *
   *  @param {Object} request
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {boolean} request.fromOpen - 是否来自open调用
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.cancelReason - 取消原因
   *  @param {number} request.operatorId
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async cancelOrder(request) {
    return this.invoke('cancelOrder', [request]);
  }

  /**
   *  订单加星
   * http://zanapi.qima-inc.com/site/service/view/119087
   *  @param {object} param
   *  @return {object}
   */
  async star(param) {
    return this.invoke('star', [param]);
  }

  /**
   * 订单备注
   * http://zanapi.qima-inc.com/site/service/view/119086
   *  @param {object} param
   *  @return {object}
   */
  async remark(param) {
    return this.invoke('remark', [param]);
  }

  /**
   * 接单
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/291867
   *
   *  @param {Object} request
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @param {boolean} request.fromOpen - 是否来自open调用
   *  @return {Promise}
   */
  async confirmOrder(request) {
    return this.invoke('confirmOrder', [request]);
  }

  /**
   *  拒单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/291868
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
  async rejectOrder(request) {
    return this.invoke('rejectOrder', [request]);
  }

  /**
   *  确认入住
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/739135
   *
   *  @param {Object} request -
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @param {boolean} request.fromOpen - 是否来自open调用
   *  @return {Promise}
   */
  async confirmReceiveOrder(request) {
    return this.invoke('confirmReceiveOrder', [request]);
  }

  /**
   *  订单改价弹框
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/119089
   *
   *  @param {Object} request -
   *  @param {string} request.orderNo - 运单no
   *  @param {number} request.kdtId - 店铺ID
   *  @return {Promise}
   */
  async changePriceWindow(request) {
    return this.invoke('changePriceWindow', [request]);
  }

  /**
   *  订单改价
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/119088
   *
   *  @param {Object} request -
   *  @param {Array.<Object>} request.deltaModifiedPriceDetail[] -
   *  @param {number} request.deltaModifiedPrice - 订单货款修改差价(正表示提价, 负表示降价)
   *  @param {string} request.orderNo - 老版本订单Id
   *  @param {number} request.kdtId - 店铺 ID
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {number} request.modifiedPostage - 改后运费
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async changePrice(request) {
    return this.invoke('changePrice', [request]);
  }

  /**
   *  超卖订单补货在订单扩展上新增超卖标：OVER_SALE_ORDER 超卖处理需求
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/515235
   *  @param {Object} request -
   *  @param {string} request.orderNo - 运单no
   *  @param {number} request.kdtId - 店铺ID
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {string} request.remark - 标记
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async overSaleOrderRestock(request) {
    return this.invoke('overSaleOrderRestock', [request]);
  }

  /**
   *  超卖订单退款
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/513226
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
  async overSaleOrderRefund(request) {
    return this.invoke('overSaleOrderRefund', [request]);
  }

  /**
   *  周期购-发货记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281111
   *
   *  @param {Object} request -
   *  @param {number} request.itemId -
   *  @param {string} request.orderNo -
   *  @param {number} request.size -
   *  @param {number} request.kdtId -
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {number} request.page -
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async periodDeliveryRecords(request) {
    return this.invoke('periodDeliveryRecords', [request]);
  }

  /**
   *  周期购-查看配送日历
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281110
   *
   *  @param {Object} request -
   *  @param {number} request.itemId -
   *  @param {string} request.orderNo -
   *  @param {number} request.kdtId -
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async periodCalendar(request) {
    return this.invoke('periodCalendar', [request]);
  }

  /**
   *  周期购-确认改期
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281108
   *
   *  @param {Object} request -
   *  @param {number} request.itemId -
   *  @param {string} request.orderNo -
   *  @param {number} request.kdtId -
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Array.<Array>} request.stopDistTime[] - 停送日期
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async periodChangeDate(request) {
    return this.invoke('periodChangeDate', [request]);
  }

  /**
   *  周期购-恢复配送
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281109
   *
   *  @param {Object} request -
   *  @param {number} request.itemId -
   *  @param {string} request.orderNo -
   *  @param {number} request.kdtId -
   *  @param {string} request.requestId - 请求标识(长度为24位)
   *  @param {Array.<Array>} request.stopDistTime[] - 恢复顺延日期
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @return {Promise}
   */
  async periodRecoverySend(request) {
    return this.invoke('periodRecoverySend', [request]);
  }
}

module.exports = OrderProcessService;
