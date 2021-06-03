const BaseService = require('../../base/BaseService');
/**
 * com.youzan.ump.voucher.core.api.service.voucher.VerifyToolService
 */
class VerifyToolService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ump.voucher.core.api.service.voucher.VerifyToolService';
  }

  /**
   *  优惠券码-导出验证工具核销记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/551168
   *
   *  @param {Object} request - 请求
   *  @param {number} request.activityId - 活动id
   *  @param {string} request.beginAt - 开始时间
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.verifyCodeKeyWord - 搜索（核销码）关键字
   *  @param {number} request.activityType - 活动类型
   *  @param {string} request.endAt - 结束时间
   *  @param {number} request.operatorId - 操作人Id
   *  @return {Promise}
   */
  async exportVerifyRecords(request) {
    return this.invoke('exportVerifyRecords', [request]);
  }
}

module.exports = VerifyToolService;
