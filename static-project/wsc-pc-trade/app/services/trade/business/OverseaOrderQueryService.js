const BaseService = require('./BusinessBaseService');

/**
 * com.youzan.trade.business.oversea.OverseaOrderQueryService
 */
class OverseaOrderQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.business.oversea.OverseaOrderQueryService';
  }

  /**
   *  是否含有未完成(或维权中)的订单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/324407
   *
   *  @param {Object} overseaQueryOrderRequestDTO -
   *  @param {number} overseaQueryOrderRequestDTO.kdtId - 店铺ID
   *  @return {Promise}
   */
  async hasOrderInProcess(overseaQueryOrderRequestDTO) {
    return this.invoke('hasOrderInProcess', [overseaQueryOrderRequestDTO]);
  }

  /**
   *  订单数据概况 今天
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/324408
   *
   *  @param {Object} overseaQueryOrderRequestDTO -
   *  @param {number} overseaQueryOrderRequestDTO.kdtId - 店铺ID
   *  @return {Promise}
   */
  async queryOrderDataOverviewRecentlyOneDay(overseaQueryOrderRequestDTO) {
    return this.invoke('queryOrderDataOverviewRecentlyOneDay', [overseaQueryOrderRequestDTO]);
  }

  /**
   *  订单数据概况 30天
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/324409
   *
   *  @param {Object} overseaQueryOrderRequestDTO -
   *  @param {number} overseaQueryOrderRequestDTO.kdtId - 店铺ID
   *  @return {Promise}
   */
  async queryOrderDataOverviewRecently30Days(overseaQueryOrderRequestDTO) {
    return this.invoke('queryOrderDataOverviewRecently30Days', [overseaQueryOrderRequestDTO]);
  }
}

module.exports = OverseaOrderQueryService;
