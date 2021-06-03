const BaseService = require('../base/BaseService');

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.search.OrderSourceToFrontEndService -
 */
class OrderSourceToFrontEndService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.search.OrderSourceToFrontEndService';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/706513
   *
   *  @param {Object} orderSourceToFrontEndDTO -
   *  @param {string} orderSourceToFrontEndDTO.source - 请求来源
   *  @return {Promise}
   */
  async orderSourceToFrontEnd(orderSourceToFrontEndDTO) {
    return this.invoke('orderSourceToFrontEnd', [orderSourceToFrontEndDTO]);
  }
}

module.exports = OrderSourceToFrontEndService;
