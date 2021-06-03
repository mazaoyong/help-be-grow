const BaseService = require('../../base/BaseService');

/* com.youzan.trade.detail.api.service.OrderInfoService -  */
class OrderInfoService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.detail.api.service.OrderInfoService';
  }

  /**
   *  获取订单及订单相关信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1257
   *
   *  @param {Object} param - 请求参数
   *  @param {string} param.app - 调用的应用
   *  @param {string} param.bizGroup - 调用的业务组
   *  @param {string} param.orderNo -
   *  @param {number} param.kdtId -
   *  @param {Object} param.options -
   *  @param {string} param.source -
   *  @return {Promise}
   */
  async get(param) {
    return this.invoke('get', [param]);
  }
}

module.exports = OrderInfoService;
