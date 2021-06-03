const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.tool.InvoiceSwitchService
 */
class InvoiceSwitchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.tool.InvoiceSwitchService';
  }

  /**
   *  开启营销中心发票服务接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/11196
   *
   *  @param {number} kdtId -
   *  @param {number} adminId -
   *  @return {Promise<any>}
   */
  async openInvoiceService(kdtId, adminId) {
    return this.invoke('openInvoiceService', [kdtId, adminId]);
  }

  /**
   *  关闭营销中心发票服务接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/11199
   *
   *  @param {number} kdtId -
   *  @param {number} adminId -
   *  @return {Promise<any>}
   */
  async closeInvoiceService(kdtId, adminId) {
    return this.invoke('closeInvoiceService', [kdtId, adminId]);
  }

  /**
   *  查询店铺的发票服务是否开启
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/11680
   *
   *  @param {number} kdtId - 店铺id
   *  @return {Promise<any>}
   */
  async isInvoiceServiceOpening(kdtId) {
    return this.invoke('isInvoiceServiceOpening', [kdtId]);
  }
}

module.exports = InvoiceSwitchService;
