const BaseService = require('../base/BaseService');
/**
 * com.youzan.ic.delivery.service.GoodsOrderExpressService
 */
class GoodsOrderExpressService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ic.delivery.service.GoodsOrderExpressService';
  }

  /**
   *  快递的接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/19257
   *
   *  @param {string} expressNo -
   *  @param {number} expressId -
   *  @return {Promise}
   */
  async getDeliveryInfo(expressNo, expressId) {
    return this.invoke('getDeliveryInfo', [expressNo, expressId]);
  }
}

module.exports = GoodsOrderExpressService;
