const BaseService = require('../base/BaseService');
/**
 * 零售退款相关接口
 */
class ReturnOrderService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.trademanager.biz.api.service.ReturnOrderService';
  }

  /**
   *  获取退货地址列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/12273
   *
   *  @param {Object} request -
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.retailSource - 订单来源
   *  @param {number} request.kdtId - 店铺ID
   *  @param {number} request.orderItemId - 订单商品ID
   *  @param {number} request.pageSize -
   *  @param {string} request.requestIp - 请求方ip
   *  @param {string} request.source - 来源 如Android iOS web
   *  @param {boolean} request.needOpeButton - 是否需要操作按钮
   *  @param {number} request.buyerId -
   *  @param {string} request.version - 版本号
   *  @param {string} request.apiVersion - carmen接口版本号
   *  @param {number} request.pageNo -
   *  @param {string} request.requestId - 请求唯一标识
   *  @param {number} request.adminId -
   *  @param {string} request.requestFrom - 请求来源
   *  @return {Promise}
   */
  async getRefundAddressLists(request) {
    return this.invoke('getRefundAddressLists', [request]);
  }

  /**
   *  获取退款订单详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10476
   *
   *  @param {Object} request - 退款详情请求参数
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.retailSource - 订单来源
   *  @param {number} request.kdtId - 店铺ID
   *  @param {string} request.requestIp - 请求方ip
   *  @param {string} request.source - 来源 如Android iOS web
   *  @param {boolean} request.needOpeButton - 是否需要操作按钮
   *  @param {number} request.buyerId -
   *  @param {string} request.version - 版本号
   *  @param {string} request.apiVersion - carmen接口版本号
   *  @param {string} request.requestId - 请求唯一标识
   *  @param {number} request.tcOrderItemId -
   *  @param {number} request.adminId -
   *  @param {string} request.refundId - 退款单号
   *  @param {string} request.requestFrom - 请求来源
   *  @return {Promise}
   */
  async getRefundDetail(request) {
    return this.invoke('getRefundDetail', [request]);
  }
}

module.exports = ReturnOrderService;
