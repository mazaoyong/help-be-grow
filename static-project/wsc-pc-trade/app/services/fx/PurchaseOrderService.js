const BaseService = require('./FxBaseService');

/**
 *  com.youzan.fx.trade.wscadaptor.pc.order.PurchaseOrderService
 */
class PurchaseOrderService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.fx.trade.wscadaptor.pc.order.PurchaseOrderService';
  }

  /**
   *  根据分销订单号查询采购订单详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/393628
   *
   *  @param {Object} purchaseOrderQueryParam -
   *  @param {number} purchaseOrderQueryParam.fxKdtId - 分销店铺kdtId
   *  @param {string} purchaseOrderQueryParam.fxOrderNo - 分销订单号
   *  @return {Promise}
   */
  async getDetailByFxOrder(purchaseOrderQueryParam) {
    return this.invoke('getDetailByFxOrder', [purchaseOrderQueryParam]);
  }
}

module.exports = PurchaseOrderService;
