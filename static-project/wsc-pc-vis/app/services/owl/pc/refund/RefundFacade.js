const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.offlineenrollment.OfflineEnrollmentGatherFacade -  */
class RefundFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.refund.RefundFacade';
  }

  /**
   *  预退课页面（订单详情跳转）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/535712
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} preRefundCommand - 预退课命令
   *  @param {string} preRefundCommand.orderNo - 订单号
   *  @param {string} preRefundCommand.alias - 单个商品alias
   *  @param {number} preRefundCommand.targetKdtId - 店铺id
   *  @param {string} preRefundCommand.skuId - 单个商品skuId
   *  @return {Promise}
   */
  async preRefundFromOrderV2(kdtId, preRefundCommand) {
    return this.invoke('preRefundFromOrderV2', [kdtId, preRefundCommand]);
  }

  /**
   *  预退课页面（学员详情跳转）
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/535714
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} preRefundCommand - 预退课命令
   *  @param {string} preRefundCommand.studentId - 学员ID
   *  @param {string} preRefundCommand.orderNo - 订单号
   *  @param {number} preRefundCommand.targetKdtId - 店铺id
   *  @param {string} preRefundCommand.assetNo - 资产编号
   *  @param {string} preRefundCommand.skuId - 单个商品skuId
   *  @return {Promise}
   */
  async preRefundFromUserV2(kdtId, preRefundCommand) {
    return this.invoke('preRefundFromUserV2', [kdtId, preRefundCommand]);
  }

  /**
   *  退课/退款
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

  /**
   *  查询指定退款金额在支付渠道上的分摊信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/693791
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 退款信息
   *  @param {number} query.refundFee - 退款金额
   *  @param {string} query.assetNo - 资产号
   *  @param {number} query.userId - 用户ID
   *  @return {Promise}
   */
  async queryAssetRefundPhasePriceInfo(kdtId, query) {
    return this.invoke('queryAssetRefundPhasePriceInfo', [kdtId, query]);
  }
}

module.exports = RefundFacade;
