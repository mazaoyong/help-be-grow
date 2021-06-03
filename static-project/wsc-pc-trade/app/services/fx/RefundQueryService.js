const BaseService = require('./FxBaseService');

/**
 *
 * @class RefundQueryService
 * @extends {BaseService}
 */
class RefundQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.fx.trade.api.refund.RefundQueryService';
  }

  /**
   * 供货商主动退款-根据采购单信息查询分销单和采购单可退金额和应承担金额，以及可退金额
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/281293
   *
   * @param {Object} supplierRefundAmtDTO - 请求参数
   * @param {number} supplierRefundAmtDTO.refundFee - 需要主动退还给买家的金额, 该申请金额可以大于采购单可退金额，不能大于分销单可退金额
   * @param {string} supplierRefundAmtDTO.orderNo - 采购单号
   * @param {number} supplierRefundAmtDTO.kdtId - 供货商kdtId
   * @param {number} supplierRefundAmtDTO.orderItemId - 采购单商品orderItemId
   * @return {Promise}
   */
  async getFxRefundableFeeByPurchaseOrder(supplierRefundAmtDTO) {
    return this.invoke('getFxRefundableFeeByPurchaseOrder', [supplierRefundAmtDTO]);
  }
}

module.exports = RefundQueryService;
