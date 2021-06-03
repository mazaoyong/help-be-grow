const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.seller.query.SellerInvoiceInfoQueryService
 */
class SellerInvoiceInfoQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.seller.query.SellerInvoiceInfoQueryService';
  }

  /**
   *  查询商家当前有效资产
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/7636
   *
   *  @param {number} kdtId -
   *  @return {Promise<any>}
   */
  async queryActiveInvoiceAssetByKdtId(kdtId) {
    return this.invoke('queryActiveInvoiceAssetByKdtId', [kdtId]);
  }

  /**
   *  获取发票设置信息查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/7633
   *
   *  @param {number} kdtId -
   *  @param {object} queryOption -
   *  @param {boolean} queryOption.needLastedFileUrl -
   *  @return {object}
   */
  async queryInvoiceSettingByKdtId(kdtId, queryOption) {
    return this.invoke('queryInvoiceSettingByKdtId', [kdtId, queryOption]);
  }
}

module.exports = SellerInvoiceInfoQueryService;
