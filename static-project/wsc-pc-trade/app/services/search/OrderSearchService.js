const SearchBaseService = require('./SearchBaseService');

/**
 * 订单搜索
 */
class OrderSearchService extends SearchBaseService {
  /**
   * 订单搜索
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.search.OrderSearchService';
  }
  /**
   * 无缓存搜索订单
   * api: http://zanapi.qima-inc.com/site/service/view/94477
   * @param {object} params
   */
  async searchFormatNoCache(params) {
    return this.invoke('searchFormatNoCache', [params]);
  }

  /**
   * 订单搜索接口(iron格式数据)
   * api: http://zanapi.qima-inc.com/site/service/view/94476
   * @param {*} params
   */
  async searchFormat(params) {
    return this.invoke('searchFormat', [params]);
  }
}

module.exports = OrderSearchService;
