const BaseService = require('../base/BaseService');

/**
 * com.youzan.retail.trademanager.biz.api.service.TradeLocalDeliveryServiceApi
 */
class TradeLocalDeliveryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.retail.trademanager.biz.api.service.TradeLocalDeliveryServiceApi';
  }

  /**
   *  自动打单设置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/721465
   *  @param {Object} config - 请求参数
   *  @param {number} config.needAutoPrint - 是否开启自动打单
   *  @param {string} config.autoPrintOption: - 自动打单选项
   *  @param {number} config.aheadTime: - 打单提前时间
   *  @return {Promise}
   */
  async updateTicket(config) {
    return this.invoke('updateTicket', [config]);
  }

  /**
   *  读取零售同城配送配置
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/721465
   *  @param {Object} params - 请求参数
   *  @param {number} config.source - 请求来源
   *  @param {number} config.type: - 门店类型
   *  @return {Promise}
   */
  async get(params) {
    return this.invoke('get', [params]);
  }
}

module.exports = TradeLocalDeliveryService;
