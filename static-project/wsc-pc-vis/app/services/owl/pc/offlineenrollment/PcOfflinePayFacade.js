const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.offlineenrollment.PcOfflinePayFacade -  */
class PcOfflinePayFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.offlineenrollment.PcOfflinePayFacade';
  }

  /**
   *  支付接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/444311
   *
   *  @param {number} kdtId -
   *  @param {Object} pcPayCommand -
   *  @param {string} pcPayCommand.payTool - 支付类型  see com.youzan.pay.gateway.api.utils.PayTool
   *  @param {string} pcPayCommand.orderNo -
   *  @param {string} pcPayCommand.authCode - 微信支付宝支付场景下使用
   *  @param {string} pcPayCommand.prepayId - 预支付单号
   *  @return {string}
   */
  async pay(kdtId, pcPayCommand) {
    return this.invoke('pay', [kdtId, pcPayCommand]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/449109
   *
   *  @param {number} kdtId
   *  @return {Promise}
   */
  async getPayToolsByEduKdtId(kdtId) {
    return this.invoke('getPayToolsByEduKdtId', [kdtId]);
  }
}

module.exports = PcOfflinePayFacade;
