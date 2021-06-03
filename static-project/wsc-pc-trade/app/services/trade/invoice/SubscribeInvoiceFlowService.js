const BaseService = require('../../base/BaseService');

/**
 * @typedef EnterpriseInfo
 * @prop {boolean} requestDTO.threeInOne - 是否三证合一
 * @prop {Object} requestDTO.extension - 扩展信息
 * @prop {string} requestDTO.taxOfficerEmail - 办税人邮箱
 * @prop {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
 * @prop {string} requestDTO.bankName - 开户行
 * @prop {string} requestDTO.invoiceAssetId - 商家发票资产id
 * @prop {Object} requestDTO.taxpayerArea - 纳税人所在区域
 * @prop {string} requestDTO.payeeName - 发票收款人名称
 * @prop {string} requestDTO.reviewerName - 发票复核人名称
 * @prop {string} requestDTO.taxOfficerPhone - 办税人手机号
 * @prop {Object} requestDTO.taxOfficerBackImg - 办税人反面面照
 * @prop {string} requestDTO.requestId - 请求幂等字段
 * @prop {string} requestDTO.taxOfficerName - 办税人姓名
 * @prop {string} requestDTO.enterpriseName - 企业名称
 * @prop {string} requestDTO.taxpayerId - 纳税人识别号
 * @prop {Object} requestDTO.threeInOneLicense - 三证合一证书DTO
 * @prop {string} requestDTO.bankAccount - 银行账户
 * @prop {Object} requestDTO.taxOfficerFrontImg - 办税人正面面照
 * @prop {string} requestDTO.bizNo - 业务字段，比如说订单号
 * @prop {number} requestDTO.kdtId - 店铺ID
 * @prop {string} requestDTO.drawer - 开票人
 * @prop {number} requestDTO.enterpriseType - 企业类型
 * @prop {string} requestDTO.enterprisePhone - 企业联系电话
 * @prop {string} requestDTO.taxOfficerType - 办税人证件类型
 * @prop {string} requestDTO.taxOfficerId - 办税人证件号
 * @prop {Object} requestDTO.commonLicense - 非三证合一证书DTO
 * @prop {string} requestDTO.invoiceId - 发票id 选填
 * @prop {number} requestDTO.invoiceTimeLimit - 开票有效期 在购买的 n 天内可申请开票
 */

/**
 * 电子发票订阅服务
 */
class SubscribeInvoiceFlowService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.seller.subscribeflow.SubscribeInvoiceFlowService';
  }

  /**
   *  提交企业信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/7618
   *  @param {EnterpriseInfo} requestDTO
   *  @return {Promise<any>}
   */
  async applyEnterpriseInfo(requestDTO) {
    return this.invoke('applyEnterpriseInfo', [requestDTO]);
  }

  /**
   *  重新提交企业信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/7621
   *  @param {EnterpriseInfo} requestDTO
   *  @return {Promise<any>}
   */
  async reSubmitEnterpriseInfo(requestDTO) {
    return this.invoke('reSubmitEnterpriseInfo', [requestDTO]);
  }

  /**
   *  提交三方发票的证书及密码生成密钥
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/4930
   *  @param {object} requestDTO -
   *  @param {string} requestDTO.tripartiteSecretKey - 三方提供给商家的密码
   *  @param {Object} requestDTO.tripartiteCertFile - 三方提供给商家的证书文件
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} requestDTO.extension - 扩展信息
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} requestDTO.invoiceId - 发票id 选填
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise<any>}
   */
  async applyTripartiteCertificate(requestDTO) {
    return this.invoke('applyTripartiteCertificate', [requestDTO]);
  }

  /**
   *  完成分类编码的配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/5881
   *  @param {object} requestDTO -
   *  @param {string} requestDTO.bizNo - 业务字段，比如说订单号
   *  @param {object} requestDTO.extension - 扩展信息
   *  @param {number} requestDTO.kdtId - 店铺ID
   *  @param {string} requestDTO.requestId - 请求幂等字段
   *  @param {string} requestDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} requestDTO.invoiceId - 发票id 选填
   *  @param {string} requestDTO.invoiceAssetId - 商家发票资产id
   *  @return {Promise<any>}
   */
  async configuredTaxClassCode(requestDTO) {
    return this.invoke('configuredTaxClassCode', [requestDTO]);
  }

  /**
   * 卖家发票资产更新status至40
   * 用于资产复制下游接口
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/744869
   * @param {number} kdtId
   * @return {Promise}
   */
  async confirmInvoiceAccount(kdtId) {
    return this.invoke('confirmInvoiceAccount', [kdtId]);
  }
}

module.exports = SubscribeInvoiceFlowService;
