const BaseService = require('../../../base/BaseService');

/**
 *
 * @class OfflineReceiptFacade
 * @extends {BaseService}
 */
class OfflineReceiptFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.offlineenrollment.OfflineReceiptFacade';
  }

  /**
   *  根据订单号查询支付凭证
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/439176
   *
   *  @param {number} kdtId -
   *  @param {string} orderNo -
   *  @return {Promise}
   */
  async getByOrderNo(kdtId, orderNo) {
    return this.invoke('getByOrderNo', [kdtId, orderNo]);
  }

  /**
   *  根据订单号查询支付凭证 v2版本
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/726394
   *
   *  @param {number} kdtId -
   *  @param {string} orderNo -
   *  @return {Promise}
   */
  async getReceiptV2(kdtId, orderNo) {
    return this.invoke('getReceiptV2', [kdtId, orderNo]);
  }
}

module.exports = OfflineReceiptFacade;
