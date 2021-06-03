const BaseService = require('../../../base/BaseService');

class LiveDashboardFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.livemarketing.LiveDashboardFacade';
  }

  /**
   * @description 查询直播间统计信息
   * @link http://zanapi.qima-inc.com/site/service/view/943931
   */
  async getLiveMarketingDashboardInfo(kdtId, liveAlias) {
    return this.invoke('getLiveMarketingDashboardInfo', [kdtId, liveAlias]);
  }

  /**
   * @description 直播间卖货开关配置
   * @link http://zanapi.qima-inc.com/site/service/view/941853
   */
  async updateLiveMarketingSetting(kdtId, settingCommand) {
    return this.invoke('updateLiveMarketingSetting', [kdtId, settingCommand]);
  }
}

module.exports = LiveDashboardFacade;
