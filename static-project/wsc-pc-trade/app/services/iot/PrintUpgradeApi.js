const BaseService = require('../base/BaseService');
/** 小票升级相关接口 */
class PrintUpgradeApi extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.iot.arena.api.service.PrintUpgradeApi';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/926708
   *
   *  @param {Object} request -
   *  @param {number} request.kdtId - 店铺kdtId
   *  @param {string} request.source - 请求系统来源
   *  @return {Promise}
   */
  async queryUpgradeStatus(request) {
    return this.invoke('queryUpgradeStatus', [request]);
  }
}

module.exports = PrintUpgradeApi;
