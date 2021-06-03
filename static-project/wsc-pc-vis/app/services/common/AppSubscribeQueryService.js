const BaseService = require('../base/BaseService');

/* com.youzan.cloud.appstore.api.service.manager.cclient.AppSubscribeQueryService -  */
class AppSubscribeQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.cloud.appstore.api.service.manager.cclient.AppSubscribeQueryService';
  }

  /**
    *  查询应用订购信息
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/467817
    *
    *  @param {Object} request - 应用订购信息的获取请求
    *  @param {number} request.appId - 应用id
    *  @param {string} request.appkey - 应用标识(非必填)
    *  @param {number} request.kdtId - 店铺ID
    *  @param {number} request.userId - 用户id
    *  @return {Promise}
  */
  async getAppSubscribeInfo(request) {
    return this.invoke('getAppSubscribeInfo', [request]);
  }
}

module.exports = AppSubscribeQueryService;
