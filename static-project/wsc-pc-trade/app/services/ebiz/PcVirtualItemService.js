const BaseService = require('../base/BaseService');

/**
 * 验证工具 虚拟商品 service
 */
class PcVirtualItemService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.verify.pc.PcVirtualItemService';
  }

  /**
   *  核销
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505667
   *
   *  @param {Object} verifyRequest - 核销参数
   *  @param {number} verifyRequest.headKdtId - 总部id
   *  @param {string} verifyRequest.orderNo - 订单编号
   *  @param {number} verifyRequest.kdtId - 当前kdtId
   *  @param {number} verifyRequest.adminId - 操作人id
   *  @return {Promise}
   */
  async verify(verifyRequest) {
    return this.invoke('verify', [verifyRequest]);
  }

  /**
   *  核销页详情数据
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505684
   *
   *  @param {Object} virtualItemRequest - 查询参数
   *  @param {number} virtualItemRequest.headKdtId - 总部id
   *  @param {string} virtualItemRequest.orderNo - 订单编号
   *  @param {number} virtualItemRequest.kdtId - 当前kdtId
   *  @return {Promise}
   */
  async queryVerifyVirtualItem(virtualItemRequest) {
    return this.invoke('queryVerifyVirtualItem', [virtualItemRequest]);
  }

  /**
   *  虚拟商品核销记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505665
   *
   *  @param {Object} virtualItemList - 查询入参
   *  @param {number} virtualItemList.headKdtId - 总部id
   *  @param {string} virtualItemList.orderNo - 订单号
   *  @param {number} virtualItemList.kdtId - 当前店铺id
   *  @param {string} virtualItemList.sortType -
   *  @param {number} virtualItemList.pageSize -
   *  @param {number} virtualItemList.startTime - 开始时间时间戳 s
   *  @param {string} virtualItemList.sortBy - 排序字段
   *  @param {number} virtualItemList.endTime - 结束时间时间戳 s
   *  @param {number} virtualItemList.page -
   *  @param {string} virtualItemList.subSortBy - 次排序字段
   *  @param {number} virtualItemList.orderKdtId - 下单店铺
   *  @param {string} virtualItemList.subSortType -
   *  @return {Promise}
   */
  async listVirtualItem(virtualItemList) {
    return this.invoke('listVirtualItem', [virtualItemList]);
  }

  /**
   *  核销记录导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/506979
   *
   *  @param {Object} virtualItemList - 查询条件
   *  @param {number} virtualItemList.headKdtId - 总部id
   *  @param {string} virtualItemList.orderNo - 订单号
   *  @param {number} virtualItemList.kdtId - 当前店铺id
   *  @param {string} virtualItemList.sortType -
   *  @param {number} virtualItemList.pageSize -
   *  @param {number} virtualItemList.startTime - 开始时间时间戳 s
   *  @param {string} virtualItemList.sortBy - 排序字段
   *  @param {number} virtualItemList.endTime - 结束时间时间戳 s
   *  @param {number} virtualItemList.page -
   *  @param {string} virtualItemList.subSortBy - 次排序字段
   *  @param {number} virtualItemList.orderKdtId - 下单店铺
   *  @param {string} virtualItemList.subSortType -
   *  @return {Promise}
   */
  async exportVirtualItem(virtualItemList) {
    return this.invoke('exportVirtualItem', [virtualItemList]);
  }

  /**
   *  导出记录查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/516902
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

module.exports = PcVirtualItemService;
