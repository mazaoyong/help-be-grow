const BaseService = require('../base/BaseService');

/**
 * com.youzan.scrm.api.customer.service.customer.CustomerDetailService
 */
class CustomerDetailService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.customer.service.customer.CustomerDetailService';
  }

  /**
   *  详情页客户基本信息聚合接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/216533
   *
   *  @param {Object} youZanAccountIdentifyDTO - 有赞帐号统一抽象标识
   *  @param {number} youZanAccountIdentifyDTO.kdtId - 店铺Id
   *  @param {string} youZanAccountIdentifyDTO.requestId - 调用请求Id
   *  @param {string} youZanAccountIdentifyDTO.appName - 调用方应用名
   *  @param {Object} youZanAccountIdentifyDTO.accountInfoDTO - 有赞帐号统一抽象标识
   *  @param {string} youZanAccountIdentifyDTO.accountInfoDTO.accountId - 帐号Id
   *  @param {integer} youZanAccountIdentifyDTO.accountInfoDTO.accountType - 帐号类型
   1 => yzUid
   2 => fansId
   3 => mobile
   *  @return {Promise}
   */
  async getCustomerBasicInfo(youZanAccountIdentifyDTO) {
    return this.invoke('getCustomerBasicInfo', [youZanAccountIdentifyDTO]);
  }
}

module.exports = CustomerDetailService;
