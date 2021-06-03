const BaseService = require('../base/BaseService');
/** 小票升级 打印相关接口 */
class CloudPrinterApi extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.iot.arena.api.service.CloudPrinterApi';
  }

  /**
   *  根据订单号及后台配置的规则打印
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/932269
   *
   *  @param {Object} request - 打印请求，订单号+模板标识
   *  @param {string} request.template - 模板，非必填，填了按模板打印，未填按规则打印，购物小票模板：shopping-receipt-v1
   *  @param {string} request.biz - 业务类型，必填。购物小票：shopping-receipt-v1，当前微商城仅购物小票
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.retailSource - 请求来源,系统名称或前端终端(替代source)
   *  @param {number} request.kdtId -
   *  @param {number} request.adminId - 操作人id
   *  @param {string} request.source - 请求来源,系统名称或前端终端。
   *  @param {Object} request.extraInfo - 扩展信息
   *  @return {Promise}
   */
  async printByOrderNo(request) {
    return this.invoke('printByOrderNo', [request]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/945214
   *
   *  @param {Object} request -
   *  @param {string} request.retailSource - 请求来源,系统名称或前端终端(替代source)
   *  @param {string} request.pendOrderId - 挂单id，微商城加菜小票为orderId
   *  @param {number} request.kdtId -
   *  @param {number} request.adminId - 操作人id
   *  @param {number} request.secondaryUnitId - 二级单元id，微商城为storeId
   *  @param {string} request.source - 请求来源,系统名称或前端终端。
   *  @return {Promise}
   */
  async printPendOrder(request) {
    return this.invoke('printPendOrder', [request]);
  }
}

module.exports = CloudPrinterApi;
