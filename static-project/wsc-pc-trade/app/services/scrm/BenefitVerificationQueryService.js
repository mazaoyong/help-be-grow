const BaseService = require('../base/BaseService');

/**
 *  com.youzan.scrm.api.verification.service.BenefitVerificationQueryService -
 */
class BenefitVerificationQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.verification.service.BenefitVerificationQueryService';
  }

  /**
   *  核销时获取可核销权益
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/513167
   *
   *  @param {Object} queryDTO - 客户查询dto
   *  @param {string} queryDTO.verificationNo - 核销码
   *  @param {number} queryDTO.kdtId - 店铺id
   *  @param {Object} queryDTO.carrierInfoDTO - 卡号 扫会员卡码时填写
   *  @param {string} queryDTO.requestId -
   *  @param {string} queryDTO.appName -
   *  @param {number} queryDTO.sourceKdtId - 店铺来源id
   *  @param {string} queryDTO.mobile - 手机号
   *  @param {number} queryDTO.benefitId - 权益id 扫权益码时填写
   *  @param {number} queryDTO.userId - 客户id
   *  @return {Promise}
   */
  async getCustomerVerificationBenefit(queryDTO) {
    return this.invoke('getCustomerVerificationBenefit', [queryDTO]);
  }
}

module.exports = BenefitVerificationQueryService;
