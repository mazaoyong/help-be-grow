const BaseService = require('../base/BaseService');

/**
 * 退款详情
 */
class RefundOperateBySellerService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.refund.operate.RefundOperateBySellerService';
  }

  /**
   *  退款详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542276
   *
   *  @param {Object} request - 入参
   *  @param {string} request.itemId - 商品ID
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.addTime -
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.messageSource - 留言角色
   *  @param {string} request.remark - 拒绝理由
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.message - 留言内容
   *  @param {number} request.version - 版本号
   *  @param {string} request.refundId - 退款单
   *  @param {Object} request.operator - 操作者信息
   *  @param {Array.<Array>} request.extInfo -
   *  @return {Promise}
   */
  async refundDetail(request) {
    return this.invoke('refundDetail', [request]);
  }

  /**
   *  校验
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/580580
   *
   *  @param {Object} request - 入参
   *  @param {number} request.itemId - 商品ID
   *  @param {number} request.refundType - 退款类型 1：sign,接受维权退款 2：accept,签收货品并退款
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @return {Promise}
   */
  async preCheck(request) {
    return this.invoke('preCheck', [request]);
  }

  /**
   *  发表留言
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542277
   *
   *  @param {Object} request - 入参
   *  @param {string} request.itemId - 商品ID
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.addTime -
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.messageSource - 留言角色
   *  @param {string} request.remark - 拒绝理由
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.message - 留言内容
   *  @param {number} request.version - 版本号
   *  @param {string} request.refundId - 退款单
   *  @param {Object} request.operator - 操作者信息
   *  @param {Array.<Array>} request.extInfo -
   *  @return {Promise}
   */
  async refundMessage(request) {
    return this.invoke('refundMessage', [request]);
  }

  /**
   *  商家同意退款
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/555213
   *  @param {Object} request - 入参
   *  @param {string} request.addTime -
   *  @param {string} request.city - 城市
   *  @param {boolean} request.cancleDist - 是否取消配送单 true：取消
   *  @param {string} request.remark - 拒绝理由
   *  @param {Object} request.source - 来源信息
   *  @param {Object} request.operator - 操作者信息
   *  @param {Array.<Array>} request.extInfo[] -
   *  @param {number} request.post - 邮编
   *  @param {string} request.province - 省份
   *  @param {Array.<Object>} request.refundItemGroup[] - 退款商品分组信息
   *  @param {number} request.localDeliveryCurrentStatus -
   *  @param {string} request.address - 退货地址
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.mobile - 收件人手机号
   *  @param {string} request.messageSource - 留言角色
   *  @param {string} request.telephone - 座机
   *  @param {string} request.message - 留言内容
   *  @param {number} request.version - 版本号
   *  @param {string} request.packId -
   *  @param {string} request.itemId - 商品ID
   *  @param {string} request.areaCode - 区号
   *  @param {string} request.warehouseId - 零售仓点信息
   *  @param {string} request.extensionNumber - 分机号
   *  @param {string} request.name - 收件人
   *  @param {string} request.region - 地区
   *  @param {string} request.refundId - 退款单
   *  @return {Promise}
   */
  async accept(request) {
    return this.invoke('accept', [request]);
  }

  /**
   *  商家拒绝退款
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542274
   *
   *  @param {Object} request - 入参
   *  @param {string} request.itemId - 商品ID
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.addTime -
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.messageSource - 留言角色
   *  @param {string} request.remark - 拒绝理由
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.message - 留言内容
   *  @param {number} request.version - 版本号
   *  @param {string} request.refundId - 退款单
   *  @param {Object} request.operator - 操作者信息
   *  @param {Array.<Array>} request.extInfo -
   *  @return {Promise}
   */
  async reject(request) {
    return this.invoke('reject', [request]);
  }

  /**
   *  商家标记同意退款
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/555212
   *
   *  @param {Object} request - 入参
   *  @param {string} request.itemId - 商品ID
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.addTime -
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.messageSource - 留言角色
   *  @param {string} request.remark - 拒绝理由
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.message - 留言内容
   *  @param {number} request.version - 版本号
   *  @param {string} request.refundId - 退款单
   *  @param {Object} request.operator - 操作者信息
   *  @param {Array.<Array>} request.extInfo -
   *  @return {Promise}
   */
  async sign(request) {
    return this.invoke('sign', [request]);
  }

  /**
   *  商家拒绝收货
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/542275
   *
   *  @param {Object} request - 入参
   *  @param {string} request.itemId - 商品ID
   *  @param {string} request.orderNo - 订单号
   *  @param {string} request.addTime -
   *  @param {number} request.kdtId - 店铺id
   *  @param {string} request.messageSource - 留言角色
   *  @param {string} request.remark - 拒绝理由
   *  @param {Object} request.source - 来源信息
   *  @param {string} request.message - 留言内容
   *  @param {number} request.version - 版本号
   *  @param {string} request.refundId - 退款单
   *  @param {Object} request.operator - 操作者信息
   *  @param {Array.<Array>} request.extInfo -
   *  @return {Promise}
   */
  async unsign(request) {
    return this.invoke('unsign', [request]);
  }

  /**
   *  查询下一条待商家处理退款单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/660587
   *
   *  @param {Object} refundOrderEsReqDTO -
   *  @param {number} refundOrderEsReqDTO.headKdtId - 零售连锁版 总店kdtId
   *  @param {number} refundOrderEsReqDTO.kdtId - 店铺ID
   *  @param {number} refundOrderEsReqDTO.createTime - 退款创建时间
   *  @return {Promise}
   */
  async queryNextRefund(refundOrderEsReqDTO) {
    return this.invoke('queryNextRefund', [refundOrderEsReqDTO]);
  }
}

module.exports = RefundOperateBySellerService;
