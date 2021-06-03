const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.seller.operate.SellerInfoOperateService
 */
class SellerInfoOperateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.seller.operate.SellerInfoOperateService';
  }

  /**
   *  修改办税人信息,修改开票设置信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/7639
   *  @param {object} reqDTO
   *  @param {Object} reqDTO.taxOfficerFrontImg - 办税人正面面照
   *  @param {string} reqDTO.bizNo - 业务字段，比如说订单号
   *  @param {Object} reqDTO.extension - 扩展信息
   *  @param {number} reqDTO.kdtId - 店铺ID
   *  @param {string} reqDTO.taxOfficerEmail - 办税人邮箱
   *  @param {string} reqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} reqDTO.drawer - 开票人
   *  @param {string} reqDTO.invoiceAssetId - 商家发票资产id
   *  @param {string} reqDTO.payeeName - 发票收款人名称
   *  @param {string} reqDTO.taxOfficerId - 办税人身份证号
   *  @param {string} reqDTO.reviewerName - 发票复核人名称
   *  @param {string} reqDTO.taxOfficerPhone - 办税人手机号
   *  @param {Object} reqDTO.taxOfficerBackImg - 办税人反面面照
   *  @param {string} reqDTO.requestId - 请求幂等字段
   *  @param {string} reqDTO.invoiceId - 发票id 选填
   *  @param {string} reqDTO.taxOfficerName - 办税人姓名
   *  @param {number} reqDTO.invoiceTimeLimit - 开票有效期 在购买的 n 天内可申请开票
   *  @return {Promise<any>}
   */
  async modifyTaxOfficerInfoAndSetting(reqDTO) {
    return this.invoke('modifyTaxOfficerInfoAndSetting', [reqDTO]);
  }

  /**
   *  修改开票主体
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/921019
   *
   *  @param {Object} reqDTO -
   *  @param {boolean} reqDTO.threeInOne - 是否三证合一
   *  @param {Object} reqDTO.extension - 扩展信息
   *  @param {string} reqDTO.taxOfficerEmail - 办税人邮箱
   *  @param {string} reqDTO.bizDate - 业务发生的时间(这笔请求发起的时间)
   *  @param {string} reqDTO.bankName - 开户行
   *  @param {string} reqDTO.invoiceAssetId - 商家发票资产id
   *  @param {Object} reqDTO.taxpayerArea - 纳税人所在区域
   *  @param {string} reqDTO.payeeName - 发票收款人名称
   *  @param {string} reqDTO.reviewerName - 发票复核人名称
   *  @param {string} reqDTO.taxOfficerPhone - 办税人手机号
   *  @param {string} reqDTO.taxOfficerType - 办税人证件类型
   *  @param {Object} reqDTO.taxOfficerBackImg - 办税人反面面照
   *  @param {string} reqDTO.requestId - 请求幂等字段
   *  @param {string} reqDTO.taxOfficerName - 办税人姓名
   *  @param {string} reqDTO.enterpriseName - 企业名称
   *  @param {string} reqDTO.taxpayerId - 纳税人识别号
   *  @param {Object} reqDTO.threeInOneLicense - 三证合一证书DTO
   *  @param {string} reqDTO.bankAccount - 银行账户
   *  @param {Object} reqDTO.taxOfficerFrontImg - 办税人正面面照
   *  @param {string} reqDTO.bizNo - 业务字段，比如说订单号
   *  @param {number} reqDTO.kdtId - 店铺ID
   *  @param {string} reqDTO.drawer - 开票人
   *  @param {number} reqDTO.enterpriseType - 企业类型
   *  @param {string} reqDTO.enterprisePhone - 企业联系电话
   *  @param {string} reqDTO.taxOfficerId - 办税人证件号
   *  @param {Object} reqDTO.commonLicense - 非三证合一证书DTO
   *  @param {string} reqDTO.invoiceId - 发票id 选填
   *  @param {number} reqDTO.invoiceTimeLimit - 开票有效期 在购买的 n 天内可申请开票
   *  @return {Promise}
   */
  async modifyInvoiceSetting(reqDTO) {
    return this.invoke('modifyInvoiceSetting', [reqDTO]);
  }
}

module.exports = SellerInfoOperateService;
