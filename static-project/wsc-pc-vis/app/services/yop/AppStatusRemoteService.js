const PCBaseService = require('@youzan/wsc-pc-base/app/services/base/PCBaseService');

/* com.youzan.yop.api.AppStatusRemoteService -  */
class AppStatusRemoteService extends PCBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.yop.api.AppStatusRemoteService';
  }

  /**
 *  获取应用服务状态 和 应用名称（如果店铺status为null,返回应用名称）
 *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/111934
 *
 *  @param {number} kdtId -
 *  @param {number} appId -
 *  @return {Promise}
*/
  async getAppStatusWithBasic(kdtId, appId) {
    return this.invoke('getAppStatusWithBasic', [kdtId, appId]);
  }
}

module.exports = AppStatusRemoteService;
