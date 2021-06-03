const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.order.OwlOrderInfoFacade -  */
class OwlOrderInfoFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.order.OwlOrderInfoFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/497090
   *
   *  @param {number} kdtId -
   *  @param {string} orderNo -
   *  @param {Object} owlOrderQueryOption - 查询参数
   *  @param {boolean} owlOrderQueryOption.includeMain -
   *  @return {Promise}
   */
  async getByOrderNo(kdtId, orderNo, owlOrderQueryOption) {
    return this.invoke('getByOrderNo', [kdtId, orderNo, owlOrderQueryOption]);
  }
}

module.exports = OwlOrderInfoFacade;
