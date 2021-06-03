const BaseService = require('../../base/BaseService');

/**
 * TradeSettingService
 */
class TradeSettingService extends BaseService {
  /**
   * @return {string}
   */
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.setting.api.TradeSettingService';
  }

  /**
   * 根据kdtId查询设置信息
   * @param {Object} params
   * @param {number} params.kdtId
   * 文档: http://zanapi.qima-inc.com/site/service/view/125759
   */
  async getSettingByKdtId(params) {
    return this.invoke('getSettingByKdtId', [params]);
  }
}

module.exports = TradeSettingService;
