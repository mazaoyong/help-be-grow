const BaseService = require('../base/BaseService');

/**
 * 验证工具 电子卡券 service
 */
class PcVirtualTicketService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.virtualticket.pc.PcVirtualTicketService';
  }

  /**
   *  核销
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/511436
   *
   *  @param {Object} pcVerifyVirtualTicketRequest - pc端核销入参
   *  @param {number} pcVerifyVirtualTicketRequest.headKdtId - 总部id
   *  @param {Array.<Array>} pcVerifyVirtualTicketRequest.ticketNos[] - 核销券码信息
   *  @param {Array} pcVerifyVirtualTicketRequest.ticketNos[] -
   *  @param {number} pcVerifyVirtualTicketRequest.kdtId - 店铺id
   *  @param {number} pcVerifyVirtualTicketRequest.adminId - 管理员id
   *  @return {Promise}
   */
  async verify(pcVerifyVirtualTicketRequest) {
    return this.invoke('verify', [pcVerifyVirtualTicketRequest]);
  }

  /**
   *  通过统一核销码或订单联系人手机号查询电子卡券信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509551
   *
   *  @param {Object} virtualTicketQuery - 电子卡券信息查询
   *  @param {number} virtualTicketQuery.headKdtId - 总部id
   *  @param {string} virtualTicketQuery.ticket - 查询参数
   *  @param {number} virtualTicketQuery.kdtId - 当前店铺
   *  @param {string} virtualTicketQuery.sortType -
   *  @param {number} virtualTicketQuery.pageSize -
   *  @param {string} virtualTicketQuery.sortBy - 排序字段
   *  @param {number} virtualTicketQuery.page -
   *  @param {string} virtualTicketQuery.subSortBy - 次排序字段
   *  @param {number} virtualTicketQuery.verifyState - 核销状态
   *  @param {string} virtualTicketQuery.subSortType -
   *  @return {Promise}
   */
  async listVerifyVirtualTicket(virtualTicketQuery) {
    return this.invoke('listVerifyVirtualTicket', [virtualTicketQuery]);
  }

  /**
   *  通过统一核销码查询电子卡券信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505803
   *
   *  @param {Object} virtualTicketQuery - 电子卡券信息查询
   *  @param {number} virtualTicketQuery.headKdtId - 总部id
   *  @param {string} virtualTicketQuery.ticket - 查询参数
   *  @param {number} virtualTicketQuery.kdtId - 当前店铺
   *  @param {string} virtualTicketQuery.sortType -
   *  @param {number} virtualTicketQuery.pageSize -
   *  @param {string} virtualTicketQuery.sortBy - 排序字段
   *  @param {number} virtualTicketQuery.page -
   *  @param {string} virtualTicketQuery.subSortBy - 次排序字段
   *  @param {number} virtualTicketQuery.verifyState - 核销状态
   *  @param {string} virtualTicketQuery.subSortType -
   *  @return {Promise}
   */
  async queryVerifyVirtualTicket(virtualTicketQuery) {
    return this.invoke('queryVerifyVirtualTicket', [virtualTicketQuery]);
  }

  /**
   *  通过订单号查询电子卡券信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/742341
   *
   *  @param {Object} virtualTicketQuery - 查询条件
   *  @param {string} virtualTicketQuery.purchaseOrderNo - 采购单号
   *  @param {number} virtualTicketQuery.headKdtId - 总部id
   *  @param {string} virtualTicketQuery.orderNo - 订单号
   *  @param {Array.<Array>} virtualTicketQuery.ticketNos[] - 核销券码信息
   *  @param {Array} virtualTicketQuery.ticketNos[] -
   *  @param {number} virtualTicketQuery.kdtId - 店铺id
   *  @param {number} virtualTicketQuery.adminId - 管理员id
   *  @return {Promise}
   */
  async queryVirtualTicketByOrderNo(virtualTicketQuery) {
    return this.invoke('queryVirtualTicketByOrderNo', [virtualTicketQuery]);
  }

  /**
   *  查询商品卡券信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505841
   *
   *  @param {Object} virtualTicketItemQuery - ticketItem查询参数
   *  @param {number} virtualTicketItemQuery.headKdtId - 总部id
   *  @param {string} virtualTicketItemQuery.orderNo - 订单号
   *  @param {number} virtualTicketItemQuery.kdtId - 当前店铺id
   *  @return {Promise}
   */
  async listVirtualTicketItem(virtualTicketItemQuery) {
    return this.invoke('listVirtualTicketItem', [virtualTicketItemQuery]);
  }

  /**
   *  电子卡券列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505802
   *
   *  @param {Object} virtualTicketListRequest - 查询入参
   *  @param {number} virtualTicketListRequest.headKdtId - 总部id
   *  @param {number} virtualTicketListRequest.verifyKdtId - 核销店铺id
   *  @param {number} virtualTicketListRequest.kdtId - 当前店铺id
   *  @param {number} virtualTicketListRequest.pageSize -
   *  @param {string} virtualTicketListRequest.subSortBy - 次排序字段
   *  @param {string} virtualTicketListRequest.ticketNo - 券码信息
   *  @param {string} virtualTicketListRequest.sortType -
   *  @param {number} virtualTicketListRequest.startTime - 开始时间时间戳 s
   *  @param {string} virtualTicketListRequest.sortBy - 排序字段
   *  @param {number} virtualTicketListRequest.state - 核销状态
   *  @param {number} virtualTicketListRequest.endTime - 结束时间时间戳 s
   *  @param {number} virtualTicketListRequest.page -
   *  @param {number} virtualTicketListRequest.orderKdtId - 下单店铺id
   *  @param {string} virtualTicketListRequest.subSortType -
   *  @return {Promise}
   */
  async listVirtualTicket(virtualTicketListRequest) {
    return this.invoke('listVirtualTicket', [virtualTicketListRequest]);
  }

  /**
   *  核销记录导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505807
   *
   *  @param {Object} virtualTicketListRequest - 查询条件
   *  @param {number} virtualTicketListRequest.headKdtId - 总部id
   *  @param {number} virtualTicketListRequest.verifyKdtId - 核销店铺id
   *  @param {number} virtualTicketListRequest.kdtId - 当前店铺id
   *  @param {number} virtualTicketListRequest.pageSize -
   *  @param {string} virtualTicketListRequest.subSortBy - 次排序字段
   *  @param {string} virtualTicketListRequest.ticketNo - 券码信息
   *  @param {string} virtualTicketListRequest.sortType -
   *  @param {number} virtualTicketListRequest.startTime - 开始时间时间戳 s
   *  @param {string} virtualTicketListRequest.sortBy - 排序字段
   *  @param {number} virtualTicketListRequest.state - 核销状态
   *  @param {number} virtualTicketListRequest.endTime - 结束时间时间戳 s
   *  @param {number} virtualTicketListRequest.page -
   *  @param {number} virtualTicketListRequest.orderKdtId - 下单店铺id
   *  @param {string} virtualTicketListRequest.subSortType -
   *  @return {Promise}
   */
  async exportVirtualTicketRecord(virtualTicketListRequest) {
    return this.invoke('exportVirtualTicketRecord', [virtualTicketListRequest]);
  }

  /**
   *  卡券有效期延长列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/509581
   *
   *  @param {Object} delayVirtualTicketListRequest - 延长查询参数
   *  @param {number} delayVirtualTicketListRequest.headKdtId - 总部id
   *  @param {number} delayVirtualTicketListRequest.payTimeStart - 付款的开始时间 ms
   *  @param {number} delayVirtualTicketListRequest.payTimeEnd - 付款时间 ms
   *  @param {number} delayVirtualTicketListRequest.kdtId - 当前店铺id
   *  @param {number} delayVirtualTicketListRequest.goodsId - 商品id
   *  @param {number} delayVirtualTicketListRequest.pageSize -
   *  @param {string} delayVirtualTicketListRequest.subSortBy - 次排序字段
   *  @param {string} delayVirtualTicketListRequest.buyerName - 买家信息
   *  @param {string} delayVirtualTicketListRequest.buyerPhone - 买家手机号
   *  @param {string} delayVirtualTicketListRequest.sortType -
   *  @param {number} delayVirtualTicketListRequest.adminId - 操作人id
   *  @param {number} delayVirtualTicketListRequest.startTime - 开始时间时间戳 s
   *  @param {string} delayVirtualTicketListRequest.sortBy - 排序字段
   *  @param {number} delayVirtualTicketListRequest.state - 核销状态
   *  @param {number} delayVirtualTicketListRequest.endTime - 结束时间时间戳 s
   *  @param {number} delayVirtualTicketListRequest.page -
   *  @param {string} delayVirtualTicketListRequest.subSortType -
   *  @return {Promise}
   */
  async listDelayVirtualTicket(delayVirtualTicketListRequest) {
    return this.invoke('listDelayVirtualTicket', [delayVirtualTicketListRequest]);
  }

  /**
   *  延迟电子卡券订单券码有效期(支持同步微信卡包)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505883
   *
   *  @param {Object} delayVirtualTicketRequest - 延长入参
   *  @param {number} delayVirtualTicketRequest.headKdtId - 总部id
   *  @param {number} delayVirtualTicketRequest.kdtId - 当前店铺id
   *  @param {Array.<Array>} delayVirtualTicketRequest.orderNos[] - 延长的订单列表
   *  @param {Array} delayVirtualTicketRequest.orderNos[] -
   *  @param {number} delayVirtualTicketRequest.adminId - 操作人id
   *  @param {number} delayVirtualTicketRequest.endTime - 截止时间（单位s）
   *  @return {Promise}
   */
  async delayEndTime(delayVirtualTicketRequest) {
    return this.invoke('delayEndTime', [delayVirtualTicketRequest]);
  }

  /**
   *  导出记录查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/516913
   *
   *  @param {Object} exportRecordRequest - 导出记录
   *  @param {number} exportRecordRequest.headKdtId - 总部id
   *  @param {number} exportRecordRequest.kdtId - 店铺id
   *  @param {string} exportRecordRequest.sortType -
   *  @param {number} exportRecordRequest.pageSize -
   *  @param {string} exportRecordRequest.sortBy - 排序字段
   *  @param {number} exportRecordRequest.page -
   *  @param {string} exportRecordRequest.subSortBy - 次排序字段
   *  @param {string} exportRecordRequest.subSortType -
   *  @return {Promise}
   */
  async listExportRecord(exportRecordRequest) {
    return this.invoke('listExportRecord', [exportRecordRequest]);
  }
}

module.exports = PcVirtualTicketService;
