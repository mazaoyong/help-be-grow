const BaseService = require('../../../base/BaseService');

class RefundRecordService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.refund.RefundFacade';
  }

  /**
    *  分页查询退课记录
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/538597
    *
    *  @param {number} kdtId - 店铺ID
    *  @param {Object} courseCommand - 退课记录查询条件
    *  @param {string} courseCommand.courseName - 线下课名称，支持模糊搜索
    *  @param {number} courseCommand.sellerId - 销售员ID
    *  @param {string} courseCommand.startTime - 退课开始时间
    *  @param {number} courseCommand.targetKdtId - 店铺id
    *  @param {string} courseCommand.endTime - 退课结束时间
    *  @param {string} courseCommand.assetNo - 资产编号
    *  @param {number} courseCommand.operatorId - 经办人ID（操作员）
    *  @param {string} courseCommand.studentNameOrPhoneNumber - 学员姓名/学员手机号，支持模糊搜索只输入数字，则匹配学员手机号进行搜索；其他文本文字，则匹配学员姓名搜索
    *  @param {Object} pageRequest - 分页
    *  @param {number} pageRequest.pageNumber -
    *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
    *  @param {number} pageRequest.pageSize -
    *  @param {Object} pageRequest.sort -
    *  @return {Promise}
    */
  async findPageRefundRecordByConditionV2(kdtId, courseCommand, pageRequest) {
    return this.invoke('findPageRefundRecordByConditionV2', [
      kdtId,
      courseCommand,
      pageRequest,
    ]);
  }

  /**
   *  ⚠️
   *  查询退课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/492039
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {string} refundNo - 退课编号
   *  @param {string} refundId - 退款ID（可为空）
   *  @return {Promise}
   */
  async findRefundRecordByRefundNo(kdtId, refundNo, refundId) {
    return this.invoke('findRefundRecordByRefundNo', [kdtId, refundNo, refundId]);
  }

  /**
   *  查询退课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/538600
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} query - 入参（属性可为空）
   *  @param {string} query.orderNo - 订单号
   *  @param {string} query.refundNo - 退课记录标识
   *  @param {number} query.targetKdtId - 店铺id
   *  @param {string} query.assetNo - 资产编号
   *  @param {number} query.skuId - 订单商品skuId
   *  @param {string} query.refundId - 退款标识
   *  @param {number} query.status - 记录状态
   *  @return {Promise}
   */
  async findRefundRecordByQueryV2(kdtId, query) {
    return this.invoke('findRefundRecordByQueryV2', [kdtId, query]);
  }
}

module.exports = RefundRecordService;
