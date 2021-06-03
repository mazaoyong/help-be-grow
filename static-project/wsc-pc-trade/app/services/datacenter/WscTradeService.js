const DatacenterBaseService = require('./DatacenterBaseService');

/**
 * 订单概况页数据中心接口
 * @class OrderTeamService
 * @extends {DatacenterBaseService}
 */
class WscTradeService extends DatacenterBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.bigdata.datacenter.wsc.api.service.order.WscTradeService';
  }

  /**
   * 获取一段时间的订单数据
   * @param {Object} params
   *
   * 文档: http://zanapi.qima-inc.com/site/service/view/273905
   */
  async getOrderTrendDaily(params) {
    return this.invoke('getOrderTrendDaily', [params]);
  }
}

module.exports = WscTradeService;
