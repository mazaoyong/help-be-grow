const DeliveryBaseService = require('./DeliveryBaseService');

/**
 * 快递发货
 */
class ExpressDeliveryService extends DeliveryBaseService {
  /**
   * ExpressDeliveryService
   */
  get SERVICE_NAME() {
    return 'com.youzan.retail.trademanager.biz.api.service.ExpressDeliveryServiceApi';
  }

  /**
   *  获取自动打单配置
   *  @param {Object} params - 请求参数
   *  @return {Promise}
   */
  async get(params) {
    return this.invoke('get', [params]);
  }

  /**
   *  更新自动打单配置
   *
   *  @param {string} params - 请求参数
   *  @param {number} params.needAutoPrint - 是否开启自动打单
   *  @param {number} params.autoPrintOption - 自动打单选项 0/1/2
   *  @param {string} params.aheadTime - 提前打单时长
   *  @return {Promise}
   */
  async updateTicket(params) {
    return this.invoke('updateTicket', [params]);
  }
}

module.exports = ExpressDeliveryService;
