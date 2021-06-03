const BaseService = require('../../base/BaseService');

/** com.youzan.scrm.api.coc.verification.CocVerificationQueryService -  */
class CocVerificationQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.coc.verification.CocVerificationQueryService';
  }

  /**
   *  核销时获取可核销权益
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/953348
   *
   *  @param {Object} queryDTO - 请求参数
   *  @param {number} queryDTO.kdtId - 店铺id
   *  @param {string} queryDTO.appName -
   *  @param {number} queryDTO.sourceKdtId - 店铺来源id
   *  @param {string} queryDTO.mobile - 手机号
   *  @param {number} queryDTO.carrierType - 载体类型
   *  @param {boolean} queryDTO.checkCustomer - 是否需要校验客户存在,不传默认为false,会根据客户是否存在进行补偿创建客户
   *  @param {number} queryDTO.originKdtId - originKdtId
   *  @param {number} queryDTO.benefitId - 权益id 扫权益码时填写
   *  @param {number} queryDTO.userId - 客户id
   *  @param {string} queryDTO.verificationNo - 核销码
   *  @param {string} queryDTO.carrierNo - 载体no,如cardNo,carrierId和carrierNo二选一或都填
   *  @param {string} queryDTO.requestId -
   *  @param {number} queryDTO.carrierId - 载体id,c端的载体id,carrierId和carrierNo二选一或都填
   *  @return {Promise}
   */
  async getCustomerVerificationBenefit(queryDTO) {
    return this.invoke('getCustomerVerificationBenefit', [queryDTO]);
  }
}

module.exports = CocVerificationQueryService;
