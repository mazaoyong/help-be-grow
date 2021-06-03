const BaseService = require('../base/BaseService');

/**
 * 到点自提 Service
 */
class SelfFetchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.selffetch.SelfFetchService';
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/440096
   * @param {Object} selfFetchTradesRequestDTO
   */
  async getSelfFetchTrades(selfFetchTradesRequestDTO) {
    return this.invoke('getSelfFetchTrades', [selfFetchTradesRequestDTO]);
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/440095
   * @param {Object} selfFetchTradeRequestDTO
   */
  async getSelfFetchTrade(selfFetchTradeRequestDTO) {
    return this.invoke('getSelfFetchTrade', [selfFetchTradeRequestDTO]);
  }

  /**
   * zanAPI: http://zanapi.qima-inc.com/site/service/view/440094
   * @param {Object} selfFetchRequestDTO
   */
  async confirm(selfFetchRequestDTO) {
    return this.invoke('confirm', [selfFetchRequestDTO]);
  }
}

module.exports = SelfFetchService;
