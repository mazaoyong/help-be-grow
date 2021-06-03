const BaseService = require('../../base/BaseService');

/* com.youzan.uic.api.user.service.UserInfoService -  */
class UserInfoService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.uic.api.user.service.UserInfoService';
  }

  /**
   *  根据userId和kdtId查询自有粉丝信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/103620
   *
   *  @param {Object} param - userId+kdtId
   *  @param {number} param.kdtId - 店铺id
   *  @param {string} param.requestId - 请求ID，忽略，不要传
   *  @param {string} param.appName - 请求应用名，建议填写应用名称，如trade
   *  @param {number} param.groupId - 组织ID，忽略，不要传
   *  @param {number} param.userId - 用户ID
   *  @return {Promise}
   */
  async getWechatUserInfoByUserId(param) {
    return this.owlInvoke('getWechatUserInfoByUserId', [param]);
  }
}

module.exports = UserInfoService;
