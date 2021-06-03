const BaseService = require('../base/BaseService');

/**
 * 批量退款
 */
class RefundBatchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.refund.operate.RefundBatchService';
  }

  /**
   *  获取上传文件到素材银行的token
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/885336
   *
   *  @param {number} kdtId - 入参
   *  @param {number} operatorId -
   *  @return {Promise}
   */
  async getToken(kdtId, operatorId) {
    return this.invoke('getToken', [kdtId, operatorId]);
  }

  /**
   *  操作批量退款
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/875270
   *
   *  @param {Object} request - 入参
   *  @param {string} request.adminName - 管理员名称
   *  @param {string} request.smsCaptcha - 验证码
   *  @param {number} request.kdtId - 店铺id
   *  @param {number} request.adminId - 管理员id
   *  @param {string} request.mobile - 手机号
   *  @param {string} request.url - 前端上传文件后拿到的url
   *  @return {Promise}
   */
  async doRefund(request) {
    return this.invoke('doRefund', [request]);
  }

  /**
   *  按页查询历史数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/875070
   *
   *  @param {Object} request - 入参
   *  @param {string} request.adminName - 管理员名称
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.adminId - 管理员id
   *  @param {number} request.count - 条数
   *  @param {number} request.page - 页数
   *  @return {Promise}
   */
  async getList(request) {
    return this.invoke('getList', [request]);
  }

  /**
   *  查询当天已经操作的次数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/875170
   *
   *  @param {number} kdtId - 入参
   *  @return {Promise}
   */
  async isOverBatchRefundTime(kdtId) {
    return this.invoke('isOverBatchRefundTime', [kdtId]);
  }
}

module.exports = RefundBatchService;
