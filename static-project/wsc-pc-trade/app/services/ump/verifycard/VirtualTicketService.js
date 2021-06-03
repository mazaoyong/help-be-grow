const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.virtualticket.VirtualTicketService -
 */
class VirtualTicketService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.virtualticket.VirtualTicketService';
  }

  /**
   *  卡券有效期延长列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/428279
   *
   *  @param {Object} orderVirtualTicketDTO -
   *  @param {string} orderVirtualTicketDTO.receiverTel - 核销人电话
   *  @param {number} orderVirtualTicketDTO.headKdtId -
   *  @param {string} orderVirtualTicketDTO.orderNo - 订单号
   *  @param {string} orderVirtualTicketDTO.ticketVerifyStatusStr - 核销状态
   *  @param {number} orderVirtualTicketDTO.payTimeStart - 付款的开始时间
   *  @param {number} orderVirtualTicketDTO.payTimeEnd - 付款时间
   *  @param {number} orderVirtualTicketDTO.kdtId -
   *  @param {number} orderVirtualTicketDTO.goodsId - 商品id
   *  @param {string} orderVirtualTicketDTO.receiverName - 核销人
   *  @param {number} orderVirtualTicketDTO.effectiveEndTime - 电子卡券有效期结束时间
   *  @param {string} orderVirtualTicketDTO.userTel - 联系人电话
   *  @param {string} orderVirtualTicketDTO.userName - 联系人
   *  @param {string} orderVirtualTicketDTO.goodsPicture - 图片
   *  @param {number} orderVirtualTicketDTO.effectiveStartTime - 电子卡券有效期开始时间
   *  @param {string} orderVirtualTicketDTO.ticketNo - 码券
   *  @param {number} orderVirtualTicketDTO.ticketVerifyStatus - 核销状态
   *  @param {string} orderVirtualTicketDTO.goodsTitle - 图片名称
   *  @param {Array.<Array>} orderVirtualTicketDTO.bizStatus - 核销状态
   *  @param {Object} pageRequest -
   *  @param {string} pageRequest.sortType -
   *  @param {number} pageRequest.pageSize -
   *  @param {string} pageRequest.sortBy - 排序字段
   *  @param {number} pageRequest.page -
   *  @param {string} pageRequest.subSortBy - 次排序字段
   *  @param {string} pageRequest.subSortType -
   *  @return {Promise}
   */
  async findDelayVirtualTicketList(orderVirtualTicketDTO, pageRequest) {
    return this.invoke('findDelayVirtualTicketList', [orderVirtualTicketDTO, pageRequest]);
  }

  /**
   *  卡券有效期延长列表--查看券码
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471337
   *
   *  @param {Object} virtualTicketDTO -
   *  @param {string} virtualTicketDTO.verifyStatueStr - 核销状态
   *  @param {number} virtualTicketDTO.headKdtId - 总店kdtId
   *  @param {number} virtualTicketDTO.verifyStatue - 核销状态
   *  @param {string} virtualTicketDTO.orderNo - 订单号
   *  @param {number} virtualTicketDTO.kdtId - 店铺ID
   *  @param {number} virtualTicketDTO.userSource - 核销来源
   *  @param {number} virtualTicketDTO.verifyTime - 核销时间
   *  @param {number} virtualTicketDTO.startCreateTime - 生成时间
   *  @param {string} virtualTicketDTO.title - 商品名称
   *  @param {number} virtualTicketDTO.updateTimeStamp - 更新时间
   *  @param {number} virtualTicketDTO.userId - 核销人
   *  @param {Array.<Array>} virtualTicketDTO.kdtIdList - 店铺ID
   *  @param {number} virtualTicketDTO.itemId - 商品ID
   *  @param {string} virtualTicketDTO.ticketNo - 码券
   *  @param {Object} virtualTicketDTO.extra - 扩展字段
   *  @param {number} virtualTicketDTO.startVerifyTime - 核销时间
   *  @param {number} virtualTicketDTO.startTime - 生成时间
   *  @param {number} virtualTicketDTO.endVerifyTime - 核销时间
   *  @param {string} virtualTicketDTO.verifyPerson - 核销人
   *  @param {number} virtualTicketDTO.shopId - 门店ID
   *  @param {number} virtualTicketDTO.shopType - 门店类型
   *  @param {number} virtualTicketDTO.endTime - 生成时间
   *  @param {Object} pageRequest -
   *  @param {string} pageRequest.sortType -
   *  @param {number} pageRequest.pageSize -
   *  @param {string} pageRequest.sortBy - 排序字段
   *  @param {number} pageRequest.page -
   *  @param {string} pageRequest.subSortBy - 次排序字段
   *  @param {string} pageRequest.subSortType -
   *  @return {Promise}
   */
  async queryTicketsByOrderNoAndStatus(virtualTicketDTO, pageRequest) {
    return this.invoke('queryTicketsByOrderNoAndStatus', [virtualTicketDTO, pageRequest]);
  }

  /**
   *  延迟电子卡券订单券码有效期(支持同步微信卡包)
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431182
   *
   *  @param {Object} extendTicketDTO -
   *  @param {number} extendTicketDTO.kdtId -
   *  @param {Array.<Array>} extendTicketDTO.orderNos[] -
   *  @param {Array} extendTicketDTO.orderNos[] -
   *  @param {number} extendTicketDTO.indate -
   *  @param {number} extendTicketDTO.userId -
   *  @return {Promise}
   */
  async extend(extendTicketDTO) {
    return this.invoke('extend', [extendTicketDTO]);
  }

  /**
   *  根据核销条件获取核销记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/471335
   *
   *  @param {Object} orderVirtualTicketDTO -
   *  @param {string} orderVirtualTicketDTO.verifyStatueStr - 核销状态
   *  @param {number} orderVirtualTicketDTO.verifyStatue - 核销状态
   *  @param {string} orderVirtualTicketDTO.orderNo - 订单号
   *  @param {number} orderVirtualTicketDTO.kdtId - 店铺ID
   *  @param {number} orderVirtualTicketDTO.userSource - 核销来源
   *  @param {number} orderVirtualTicketDTO.createTimeStamp - 生成时间
   *  @param {number} orderVirtualTicketDTO.verifyTime - 核销时间
   *  @param {number} orderVirtualTicketDTO.startCreateTime - 生成时间
   *  @param {string} orderVirtualTicketDTO.title - 商品名称
   *  @param {number} orderVirtualTicketDTO.updateTimeStamp - 更新时间
   *  @param {number} orderVirtualTicketDTO.userId - 核销人
   *  @param {Array.<Array>} orderVirtualTicketDTO.kdtIdList - 店铺ID
   *  @param {number} orderVirtualTicketDTO.endCreateTime - 生成时间
   *  @param {number} orderVirtualTicketDTO.itemId - 商品ID
   *  @param {string} orderVirtualTicketDTO.ticketNo - 码券
   *  @param {Object} orderVirtualTicketDTO.extra - 扩展字段
   *  @param {number} orderVirtualTicketDTO.startVerifyTime - 核销时间
   *  @param {number} orderVirtualTicketDTO.endVerifyTime - 核销时间
   *  @param {string} orderVirtualTicketDTO.verifyPerson - 核销人
   *  @param {number} orderVirtualTicketDTO.shopId - 门店ID
   *  @param {number} orderVirtualTicketDTO.shopType - 门店类型
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {string} pageRequest.sortType -
   *  @param {number} pageRequest.pageSize -
   *  @param {string} pageRequest.sortBy - 排序字段
   *  @param {string} pageRequest.subSortBy - 次排序字段
   *  @param {string} pageRequest.subSortType -
   *  @return {Promise}
   */
  async findOrderVirtualTicketList(orderVirtualTicketDTO, pageRequest) {
    return this.invoke('findOrderVirtualTicketList', [orderVirtualTicketDTO, pageRequest]);
  }
}

module.exports = VirtualTicketService;
