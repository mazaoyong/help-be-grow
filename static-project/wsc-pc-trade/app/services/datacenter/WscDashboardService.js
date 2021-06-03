const DatacenterBaseService = require('./DatacenterBaseService');

/**
 * 订单概况页数据中心接口
 * @class WscDashboardService
 * @extends {DatacenterBaseService}
 */
class WscDashboardService extends DatacenterBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.bigdata.datacenter.wsc.api.service.WscDashboardService';
  }

  /**
   * 获取微商城工作台看板数据
   * @param {Object} params
   *
   * 文档: http://zanapi.qima-inc.com/site/service/view/271521
   */
  async getWscDashboard(params) {
    return this.invoke('getWscDashboard', [params]);
  }
}

module.exports = WscDashboardService;
