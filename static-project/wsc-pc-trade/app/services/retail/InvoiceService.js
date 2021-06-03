const BaseService = require('../base/BaseService');

/**
 * com.youzan.retail.trademanager.biz.api.service.invoice.InvoiceService
 */
class InvoiceService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.trademanager.biz.api.service.invoice.InvoiceService';
  }

  /**
   *  店铺授权接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/287034
   *
   *  @param {Object} request -
   *  @param {Array<number>} request.authKdtIdList[] - 被授权店铺kdtId
   *  @param {number} request.kdtId - 授权店铺kdtId
   *  @param {number} request.adminId -
   *  @return {Promise}
   */
  async authInvoiceByKdtId(request) {
    return this.invoke('authInvoiceByKdtId', [request]);
  }

  /**
   *  电子发票授权解除接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/336024
   *
   *  @param {Object} request -
   *  @param {Array<number>} request.authKdtIdList[] - 被授权店铺kdtId
   *  @param {number} request.kdtId - 授权店铺kdtId
   *  @param {number} request.adminId -
   *  @return {Promise}
   */
  async deleteInvoiceAuthByKdtId(request) {
    return this.invoke('deleteInvoiceAuthByKdtId', [request]);
  }
}

module.exports = InvoiceService;
