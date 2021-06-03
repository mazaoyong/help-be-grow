const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.detail.api.service.OrderDetailService
 */
class OrderDetailService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.detail.api.service.OrderDetailService';
  }

  /**
   *  获取订单及订单相关信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1257
   *  https://doc.qima-inc.com/pages/viewpage.action?pageId=21675788
   *
   *  @param {object} param
   *  @param {string} param.app - 调用的应用
   *  @param {string} param.bizGroup - 调用的业务组
   *  @param {string} param.orderNo -
   *  @param {number} param.kdtId -
   *  @param {Object} param.options -
   *  @param {string} param.source -
   *  @return {Promise<any>}
   */
  async getOrders(param) {
    return this.invoke('getOrders', [param]);
  }
}

module.exports = OrderDetailService;
