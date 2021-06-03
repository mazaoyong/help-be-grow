const BaseService = require('../base/BaseService');

/**
 * FoodOrderService
 */
class FoodOrderService extends BaseService {
  /**
   * FoodOrderService
   */
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.rigel.api.eatinorder.service.FoodOrderService';
  }

  /**
   *  取消订单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/226228
   *
   *  @param {object} cancelDTO
   *  @param {number} cancelDTO.orderId
   *  @param {number} cancelDTO.kdtId
   *  @param {number} cancelDTO.storeId
   *  @return {object}
   */
  async cancelOrder(cancelDTO) {
    return this.invoke('cancelOrder', [cancelDTO]);
  }
}

module.exports = FoodOrderService;
