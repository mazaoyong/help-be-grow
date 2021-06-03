const BaseService = require('../../base/BaseService');

/** com.youzan.trade.invoice.api.seller.query.InvoiceAuthorizeRelationQueryService -  */
class InvoiceAuthorizeRelationQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.seller.query.InvoiceAuthorizeRelationQueryService';
  }

  /**
   *  根据被授权kdtId查找授权关系
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/299927
   *
   *  @param {Object} requestDTO -
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} requestDTO.extension - 扩展信息
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {number} requestDTO.authorizedKdtId - 根据authorizedKdtId查询
   *  @param {string} requestDTO.invoiceId - 发票id
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise}
   */
  async getInvoiceAuthorizer(requestDTO) {
    return this.invoke('getInvoiceAuthorizer', [requestDTO]);
  }

  /**
   *  根据kdtId查找授权关系
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/299928
   *
   *  @param {Object} requestDTO -
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} requestDTO.extension - 扩展信息
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} requestDTO.invoiceId - 发票id
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise}
   */
  async getAuthorizedRelation(requestDTO) {
    return this.invoke('getAuthorizedRelation', [requestDTO]);
  }
}

module.exports = InvoiceAuthorizeRelationQueryService;
