const BaseService = require('../../base/BaseService');
/**
 */
class CountryCodeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.api.countryCode.service.CountryCodeService';
  }

  /**
   *  获取所有国家码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/6223
   *
   *  @param {Object} param -
   *  @param {string} param.requestId - 请求ID，忽略，不要传
   *  @param {string} param.appName - 请求应用名，建议填写应用名称，如trade
   *  @param {number} param.groupId - 组织ID，忽略，不要传
   *  @param {number} param.businessId - 业务单元ID，比如是店铺，就传KDTID
   *  @param {number} param.businessType - 业务单元类型，比如是店铺，就固定传1
   *  @return {Promise}
   */
  async get(dto) {
    return this.invoke('get', [dto]);
  }
}

module.exports = CountryCodeService;
