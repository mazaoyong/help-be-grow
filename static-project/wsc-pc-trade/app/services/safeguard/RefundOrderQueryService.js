/* com.youzan.trade.safeguard.api.query.RefundOrderQueryService -  */
const BaseService = require('../base/BaseService');

/**
 * 退款信息查询
 */
class RefundOrderQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.safeguard.api.query.RefundOrderQueryService';
  }

  /**
   *  退款查询接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/115857
   *
   *  @param {Object} orderQueryReqDTO -
   *  @param {number} orderQueryReqDTO.itemId - 商品id
   *  @param {Object} orderQueryReqDTO.queryParamsOption - 选项查询
   *  @param {boolean} orderQueryReqDTO.queryParamsOption.inculdeHistory - 是否包含历史退款单
   *  @param {boolean} orderQueryReqDTO.queryParamsOption.inculdeMessage - 是否包含留言
   *  @param {string} orderQueryReqDTO.orderNo - 订单号
   *  @param {number} orderQueryReqDTO.kdtId - 店铺id
   *  @param {number} orderQueryReqDTO.adminId - 操作人
   *  @return {Promise}
   */
  async getByOrderNo(orderQueryReqDTO) {
    return this.invoke('getByOrderNo', [orderQueryReqDTO]);
  }
}

module.exports = RefundOrderQueryService;
