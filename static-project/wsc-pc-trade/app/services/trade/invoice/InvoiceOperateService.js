const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.invoice.operate.InvoiceOperateService
 */
class InvoiceOperateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.invoice.operate.InvoiceOperateService';
  }

  /**
   *  冲红
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/10392
   *
   *  @param {string} requestDTO - 业务字段，比如说订单号
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} requestDTO.extension - 扩展信息
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} requestDTO.invoiceId - 发票id 选填
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise<any>}
   */
  async redInvoiceApply(requestDTO) {
    return this.invoke('redInvoiceApply', [requestDTO]);
  }

  /**
   *  手动开票
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/76632
   *
   *  @param {object} requestDTO
   *  @param {Array.<Object>} requestDTO.invoiceDetail[] - 发票详情
   *  @param {boolean} requestDTO.auto - 是否是自动开票
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} requestDTO.extension - 扩展信息
   *  @param {boolean} requestDTO.redInvoice - 是否为红票
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} requestDTO.invoiceDetailType - 发票详情类型 itemCategory 商品类别 itemDetail 商品明细
   *  @param {number} requestDTO.type - 发票种类
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @param {Object} requestDTO.invoiceHeader - 发票头
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {Object} requestDTO.smsSettingDTO - 收票邮箱手机号码等等
   *  @param {string} requestDTO.invoiceId - 发票id 选填
   *  @return {object}
   */
  async manualInvoiceApply(requestDTO) {
    return this.invoke('manualInvoiceApply', [requestDTO]);
  }

  /**
   *  开票重试
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/279653
   *
   *  @param {Object} requestDTO -
   *  @param {Array.<Object>} requestDTO.invoiceDetail[] - 发票详情
   *  @param {boolean} requestDTO.auto - 是否是自动开票
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} requestDTO.extension - 扩展信息
   *  @param {boolean} requestDTO.redInvoice - 是否为红票
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} requestDTO.invoiceDetailType - 发票详情类型 itemCategory 商品类别 itemDetail 商品明细
   *  @param {number} requestDTO.type - 发票种类
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @param {Object} requestDTO.invoiceHeader - 发票头
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {Object} requestDTO.smsSettingDTO - 收票邮箱手机号码等等
   *  @param {string} requestDTO.invoiceId - 发票id 选填
   *  @return {Promise}
   */
  async retryInvoiceApply(requestDTO) {
    return this.invoke('retryInvoiceApply', [requestDTO]);
  }
}

module.exports = InvoiceOperateService;
