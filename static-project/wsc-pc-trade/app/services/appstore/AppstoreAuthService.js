const BaseService = require('../base/BaseService');

/**
 * AppstoreAuthService
 */
class AppstoreAuthService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.cloud.appstore.api.service.auth.AppstoreAuthService';
  }

  /**
   *  去使用功能 获取 referenceUrl + userToken
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/381792
   *
   *  @param {Object} useAppRequest -
   *  @param {number} useAppRequest.innerItemId - 内购项id appId和innerItemId 两者必须有一个
   *  @param {number} useAppRequest.kdtId - 授权的店铺kdtId
   *  @param {string} useAppRequest.phone - 订购人手机号 非必填
   *  @param {number} useAppRequest.appId - 工具型appId appId和innerItemId 两者必须有一个
   *  @param {number} useAppRequest.pageId - 微页面id
   *  @param {number} useAppRequest.userId - 用户id
   *  @return {Promise}
   */
  async useApp(useAppRequest) {
    return this.invoke('useApp', [useAppRequest]);
  }
}

module.exports = AppstoreAuthService;
