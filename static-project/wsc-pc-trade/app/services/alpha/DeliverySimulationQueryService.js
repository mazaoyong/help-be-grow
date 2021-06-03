const AlphaBaseService = require('./AlphaBaseService');

/**
 * 查询仿真记录
 * @class DeliverySimulationQueryService
 * @extends {AlphaBaseService}
 */
class DeliverySimulationQueryService extends AlphaBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.alpha.express.api.service.DeliverySimulationQueryService';
  }

  /**
   * 查询仿真记录
   * @param {Object} params
   *
   * 文档: http://zanapi.qima-inc.com/site/service/view/290730
   */
  async querySimulation(params) {
    return this.invoke('querySimulation', [params]);
  }
}

module.exports = DeliverySimulationQueryService;
