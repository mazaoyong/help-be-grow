const BaseService = require('../base/BaseService');

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.refund.SellerRefundService
 */
class SellerRefundService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.refund.SellerRefundService';
  }

  /**
   *  退款资金流水记录查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428226
   *
   *  @param {Object} refundFundRequestDTO -
   *  @param {string} refundFundRequestDTO.orderNo - 订单号
   *  @param {boolean} refundFundRequestDTO.showRefundFail - 是否需要展示退款失败的资金流水信息
   *  @param {number} refundFundRequestDTO.kdtId - 店铺ID
   *  @return {Promise}
   */
  async queryRefundFundAggr(refundFundRequestDTO) {
    return this.invoke('queryRefundFundAggr', [refundFundRequestDTO]);
  }

  /**
   * 商家从ES查询退款单信息
   * zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/432547
   * @param {Object} refundOrderEsReqDTO -
   *  @param {number} refundOrderEsReqDTO.updateTimeEnd - 时间范围查询 退款更新 截止时间
   *  @param {number} refundOrderEsReqDTO.pageSize - 每页显示个数
   *  @param {number} refundOrderEsReqDTO.createTimeStart - 时间范围查询 退款创建 起始时间 单位为s(秒)
   *  @param {Object} refundOrderEsReqDTO.source - 退款列表来源
   *  @param {number} refundOrderEsReqDTO.type - 退款流程类型
   *  @param {number} refundOrderEsReqDTO.buyerId - 买家id
   *  @param {number} refundOrderEsReqDTO.involvedStatus - null:全部 0:未介入、介入完成 1:客服介入中
   *  @param {number} refundOrderEsReqDTO.pageNo - 分页数
   *  @param {Array.<Array>} refundOrderEsReqDTO.notChannelType[]
   *  @param {number} refundOrderEsReqDTO.refundTimeoutSortType - 退款toc排序条件0:desc1:asc
   *  @param {number} refundOrderEsReqDTO.operatorId - 操作人id
   *  @param {number} refundOrderEsReqDTO.phase - 退款类型(退款阶段) 1:售中 2:售后
   *  @param {number} refundOrderEsReqDTO.headKdtId - 连锁版总店店铺ID
   *  @param {string} refundOrderEsReqDTO.orderNo - 订单号
   *  @param {number} refundOrderEsReqDTO.kdtId - 店铺ID
   *  @param {number} refundOrderEsReqDTO.createTimeEnd - 时间范围查询 退款创建 截止时间
   *  @param {string} refundOrderEsReqDTO.deliveryNo - 物流单号
   *  @param {number} refundOrderEsReqDTO.updateTimeStart - 时间范围查询 退款更新 起始时间 单位为s(秒)
   *  @param {number} refundOrderEsReqDTO.demand - 退款方式(退款诉求) 1:仅退款 2:退货退款
   *  @param {Array.<Array>} refundOrderEsReqDTO.kdtIdList - 批量kdtId查询条件
   *  @param {number} refundOrderEsReqDTO.searchTag - 0:待商家处1:待买家处理 2:客服介入中
   *  @param {number} refundOrderEsReqDTO.csStatus - 客服介入
   *  @param {number} refundOrderEsReqDTO.sortType - 0:desc 1:asc
   *  @param {Array.<Array>} refundOrderEsReqDTO.refundIdList - 批量退款单号查询条件
   *  @param {string} refundOrderEsReqDTO.skuNo - 商品条码号
   *  @param {number} refundOrderEsReqDTO.invalid - 是否为无效的退款单 true是无效 数据库是1，false是有效 数据库是0
   *  @param {string} refundOrderEsReqDTO.goodsTitle - 商品名称
   *  @param {number} refundOrderEsReqDTO.saleWay - 销售渠道 1:门店 2:网店
   *  @param {number} refundOrderEsReqDTO.refundMode -
   *  @param {Array.<Array>} refundOrderEsReqDTO.orderNoList - 批量订单号查询条件
   *  @param {string} refundOrderEsReqDTO.refundId - 退款号
   *  @param {number} refundOrderEsReqDTO.deliveryStatus - 退款时发货状态 注意!不是发货状态 未发货:1 | 已发货:2
   *  @param {number} refundOrderEsReqDTO.status - 退款状态
   *  @return {Promise}
   */
  async queryRefundOrderFromES(refundOrderEsReqDTO) {
    return this.invoke('queryRefundOrderFromES', [refundOrderEsReqDTO], {
      allowBigNumberInJSON: true,
    });
  }

  /**
   *  获取卡券列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/697306
   *
   *  @param {Object} request -
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺 ID
   *  @param {number} request.pageSize - 每页显示个数
   *  @param {number} request.page - 当前页
   *  @return {Promise}
   */
  async queryTicketsList(request) {
    return this.invoke('queryTicketsList', [request]);
  }

  /**
   *  获取订单单商品可退款余额
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/755964
   *
   *  @param {Object} request -
   *  @param {number} request.itemId - 退款商品id
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺id
   *  @return {Promise}
   */
  async getRefundableFee(request) {
    return this.invoke('getRefundableFee', [request]);
  }

  /**
   *
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/697309
   *
   *  @param {Object} request -
   *  @param {string} request.packId - kdt_id+原packId
   *  @param {number} request.itemId - 订单商品id
   *  @param {Array.<Array>} request.refundItems[] - 退款商品列表
   *  @param {number} request.refundFee - 本次退款申请的总退款金额
   *  @param {Array.<Array>} request.couponIds[] - 失效卡券ids集合
   *  @param {Object} request.extension - 扩展信息
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺ID
   *  @param {string} request.remark - 原因描述
   *  @param {Object} request.source - 来源信息
   *  @param {number} request.operatorId - 操作人ID
   *  @param {number} request.localDeliveryCurrentStatus -
   *  @param {number} request.disabledTicketCount - 失效卡券数量
   *  @return {boolean}
   */
  async activeRefundBySeller(request) {
    return this.invoke('activeRefundBySeller', [request]);
  }

  /**
   *  获取判断商品退款时是否需要取消商品对应的配送单信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/697308
   *
   *  @param {Object} request -
   *  @param {number} request.itemId - 订单商品id
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺ID
   *  @return {Promise}
   */
  async queryCancelDistOrderInfo(request) {
    return this.invoke('queryCancelDistOrderInfo', [request]);
  }

  /**
   *  获取订单多商品可退款余额
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1057833
   *
   *  @param {Object} request -
   *  @param {Array.<Array>} request.itemIds[] - 订单商品id
   *  @param {string} request.orderNo - 订单号
   *  @param {number} request.kdtId - 店铺ID
   *  @return {Promise}
   */
  async getRefundableFees(request) {
    return this.invoke('getRefundableFees', [request]);
  }
}

module.exports = SellerRefundService;
