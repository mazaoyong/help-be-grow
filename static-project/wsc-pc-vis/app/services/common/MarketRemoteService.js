const BaseService = require('../base/BaseService');

class MarketRemoteService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.yop.api.MarketRemoteService';
  }

  /**
   * 获取插件服务状态：过期还是有效
   *
   * @param {string} kdtId 店铺 ID
   * @param {string} appId 插件 ID
   */
  async getAppStatus(kdtId, appId) {
    const result = await this.invoke('findApplicationStatus', [kdtId, appId]);
    return result || {};
  }
}

module.exports = MarketRemoteService;
