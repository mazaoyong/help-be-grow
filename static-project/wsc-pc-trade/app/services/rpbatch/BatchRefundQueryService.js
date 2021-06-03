const BaseService = require('../base/BaseService');

/**
 * com.youzan.trade.rpbatch.api.query.BatchRefundQueryService -
 **/
class BatchRefundQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.rpbatch.api.query.BatchRefundQueryService';
  }

  /**
   * 校验退款单是否可进行批处理操作
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/202252
   *
   * @param {object} params
   * @param {Array} params.refundIdList[] -
   * @param {number} params.demand - 退款诉求
   * @param {number} params.status - 退款状态
   * @return {object}
   */
  async queryIsAllowBatchOperate(params) {
    return this.invoke('queryIsAllowBatchOperate', [params]);
  }

  /**
   * 查询退款操作结果
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/208450
   *
   * @param {object} params -
   * @param {string} params.operate - "agree" 商家同意退款 / "refuse" 商家拒绝退款 / "goods_return_agree" 商家同意退货
   * @param {Array} params.refundIds[] -
   * @return {object}
   */
  async queryRefundOperateResult(params) {
    return this.invoke('queryRefundOperateResult', [params]);
  }
}

module.exports = BatchRefundQueryService;
