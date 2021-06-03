const BaseService = require('../../base/BaseService');

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.export.VirtualOrderExportService
 */
class VirtualOrderExportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.export.VirtualOrderExportService';
  }
  /**
   *  导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/431550
   *
   *  @param {Object} virtualTicketDTO -
   *  @param {string} virtualTicketDTO.shopName - 店铺名称
   *  @param {number} virtualTicketDTO.verifyTime - 核销时间
   *  @param {number} virtualTicketDTO.startCreateTime - 生成时间
   *  @param {string} virtualTicketDTO.title - 商品名称
   *  @param {number} virtualTicketDTO.updateTimeStamp - 更新时间
   *  @param {string} virtualTicketDTO.ticketNo - 码券
   *  @param {Object} virtualTicketDTO.extra - 扩展字段
   *  @param {string} virtualTicketDTO.startVerifyTime - 核销时间
   *  @param {number} virtualTicketDTO.startTime - 生成时间
   *  @param {string} virtualTicketDTO.verifyPerson - 核销人
   *  @param {number} virtualTicketDTO.shopId - 门店ID
   *  @param {number} virtualTicketDTO.headKdtId - 总店kdtId
   *  @param {string} virtualTicketDTO.orderNo - 订单号
   *  @param {string} virtualTicketDTO.verifyStateStr - 核销状态
   *  @param {number} virtualTicketDTO.kdtId - 店铺ID
   *  @param {number} virtualTicketDTO.userSource - 核销来源
   *  @param {string} virtualTicketDTO.verifyTimeStr - 核销时间
   *  @param {string} virtualTicketDTO.userName - 核销人
   *  @param {number} virtualTicketDTO.userId - 核销人
   *  @param {Array.<Array>} virtualTicketDTO.kdtIdList - 店铺ID
   *  @param {number} virtualTicketDTO.verifyState - 核销状态
   *  @param {number} virtualTicketDTO.itemId - 商品ID
   *  @param {string} virtualTicketDTO.endVerifyTime - 核销时间
   *  @param {number} virtualTicketDTO.shopType - 门店类型
   *  @param {number} virtualTicketDTO.endTime - 生成时间
   *  @return {Promise}
   */
  async export(virtualTicketDTO) {
    return this.invoke('export', [virtualTicketDTO]);
  }
}

module.exports = VirtualOrderExportService;
