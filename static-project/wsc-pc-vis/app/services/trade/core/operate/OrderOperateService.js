const BaseService = require('../../../base/BaseService');

/* com.youzan.trade.core.service.operate.OrderOperateService -  */
class OrderOperateService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.core.service.operate.OrderOperateService';
  }

  /**
   *  将订单置为不可见
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/4498
   *
   *  @param {Object} invisibleOrderRequestDTO
   *  @param {number} invisibleOrderRequestDTO.orderId - 订单Id
   *  @param {boolean} invisibleOrderRequestDTO.needRevertStock - 是否需要还库存（选填）这个参数不提供打标能力
   *  @param {boolean} invisibleOrderRequestDTO.fromOpen - 是否来自open调用。
   *  @return {Promise}
   */
  async invisibleOrderById(invisibleOrderRequestDTO) {
    return this.invoke('invisibleOrderById', [invisibleOrderRequestDTO]);
  }
}

module.exports = OrderOperateService;
