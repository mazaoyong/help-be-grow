const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.refund.RefundFacade -  */
class RefundFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.refund.RefundFacade';
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/535716
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} refundCommand - 退款/退款参数
   *  @param {Array.<Object>} refundCommand.refundItemList[] - 所申请退款的商品信息
   *  @param {string} refundCommand.remark - 退课备注
   *  @param {number} refundCommand.targetKdtId - 店铺id
   *  @param {number} refundCommand.operatorId - 经办人ID（操作员）
   *  @param {string} refundCommand.operatorName - 操作人
   *  @return {Promise}
   */
  async refundV2(kdtId, refundCommand) {
    return this.invoke('refundV2', [kdtId, refundCommand]);
  }
}

module.exports = RefundFacade;
