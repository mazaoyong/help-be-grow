const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.invoice.invoiceToGrantAuthorizationService
 */
class InvoiceToGrantAuthorizationService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.invoice.invoiceToGrantAuthorizationService';
  }

  /**
   *  电子发票授权能力
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/848281
   *
   *  @param {Array} kdtIds - 需要授权的分店kdtIds
   *  @param {number} hqKdtId - 总部kdtId
   *  @param {number} operatorId -
   *  @return {Promise}
   */
  async invoiceAuthorization(kdtIds, hqKdtId, operatorId) {
    return this.invoke('invoiceAuthorization', [kdtIds, hqKdtId, operatorId]);
  }

  /**
   *  解除授权
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/848282
   *
   *  @param {number} kdtId - 需要解除授权的分店kdtId
   *  @param {number} hqKdtId - 总部kdtId
   *  @param {number} operatorId - 操作人
   *  @return {Promise}
   */
  async relieveOneRelation(kdtId, hqKdtId, operatorId) {
    return this.invoke('relieveOneRelation', [kdtId, hqKdtId, operatorId]);
  }
}

module.exports = InvoiceToGrantAuthorizationService;
