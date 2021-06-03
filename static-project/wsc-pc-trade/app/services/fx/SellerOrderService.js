const BaseService = require('./FxBaseService');

/**
 * 分销采购单
 */
class SellerOrderService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.fx.trade.api.core.SellerOrderService';
  }

  /**
   * 分销采购单搜索
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/303087
   *
   * @param {*} requestDTO
   * @param {Enum} requestDTO.purchageOrderStatus - 1:全部, 2:待付款, 3:待供货商发货, 4:供货商已发货, 5:已完成, 6:已关闭
   */
  async getPurchaseOrderList(requestDTO) {
    return this.invoke('getPurchaseOrderList', [requestDTO]);
  }

  /**
   *  根据分销单，批量查询采购单主动付货款信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/303088
   *
   *  @param {Object} requestDTO - 查询参数
   *  @param {number} requestDTO.kdtId - 分销店铺id
   *  @param {Array.<Array>} requestDTO.orderNos[] - 待付款的分销单号
   *  @param {Array} requestDTO.orderNos[] -
   *  @return {Promise}
   */
  async getActivePayInfoByBuyerOrders(requestDTO) {
    return this.invoke('getActivePayInfoByBuyerOrders', [requestDTO]);
  }

  /**
   *  根据分销单主动支付采购单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/285615
   *
   *  @param {Object} requestDTO - 主动支付参数
   *  @param {number} requestDTO.kdtId - 分销商店铺id
   *  @param {Array.<Array>} requestDTO.orderNos[] - 分销单号
   *  @param {Array} requestDTO.orderNos[] -
   *  @return {Promise}
   */
  async activePayPurchaseOrder(requestDTO) {
    return this.invoke('activePayPurchaseOrder', [requestDTO]);
  }

  /**
   *  查询采购单批量支付结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/310620
   *
   *  @param {string} activePayId - 主动支付id
   *  @return {Promise}
   */
  async getActivePayProcessInfo(activePayId) {
    return this.invoke('getActivePayProcessInfo', [activePayId]);
  }
}

module.exports = SellerOrderService;
