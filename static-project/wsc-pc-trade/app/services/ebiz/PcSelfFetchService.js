const BaseService = require('../base/BaseService');

/**
 * 验证工具 自提 service
 */
class PcSelfFetchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.selffetch.pc.PcSelfFetchService';
  }

  /**
   *  核销
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/505772
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
   *  核销详情页
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/504480
   *
   *  @param {Object} verifyQuerySelfFetch - 查询入参
   *  @param {number} verifyQuerySelfFetch.headKdtId - 总部id
   *  @param {string} verifyQuerySelfFetch.selfFetchNo - 自提码
   *  @param {number} verifyQuerySelfFetch.kdtId - 当前kdtId
   *  @return {Promise}
   */
  async queryVerifySelfFetch(verifyQuerySelfFetch) {
    return this.invoke('queryVerifySelfFetch', [verifyQuerySelfFetch]);
  }

  /**
   *  自提记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/504479
   *
   *  @param {Object} selfFetchListRequest - 查询入参
   *  @param {number} selfFetchListRequest.headKdtId - 总部id
   *  @param {string} selfFetchListRequest.orderNo - 订单号
   *  @param {number} selfFetchListRequest.kdtId - 当前店铺id
   *  @param {number} selfFetchListRequest.pageSize -
   *  @param {string} selfFetchListRequest.subSortBy - 次排序字段
   *  @param {string} selfFetchListRequest.sortType -
   *  @param {number} selfFetchListRequest.selfFetchKdtId - 自提店铺
   *  @param {number} selfFetchListRequest.startTime - 开始时间时间戳 s
   *  @param {string} selfFetchListRequest.sortBy - 排序字段
   *  @param {number} selfFetchListRequest.endTime - 结束时间时间戳 s
   *  @param {number} selfFetchListRequest.page -
   *  @param {number} selfFetchListRequest.orderKdtId - 下单店铺
   *  @param {string} selfFetchListRequest.subSortType -
   *  @return {Promise}
   */
  async listSelfFetch(selfFetchListRequest) {
    return this.invoke('listSelfFetch', [selfFetchListRequest]);
  }

  /**
   *  核销记录导出
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/506996
   *
   *  @param {Object} listQuerySelfFetch - 查询条件
   *  @param {number} listQuerySelfFetch.headKdtId - 总部id
   *  @param {string} listQuerySelfFetch.orderNo - 订单号
   *  @param {number} listQuerySelfFetch.kdtId - 当前店铺id
   *  @param {number} listQuerySelfFetch.pageSize -
   *  @param {string} listQuerySelfFetch.subSortBy - 次排序字段
   *  @param {string} listQuerySelfFetch.sortType -
   *  @param {number} listQuerySelfFetch.selfFetchKdtId - 自提店铺
   *  @param {number} listQuerySelfFetch.startTime - 开始时间时间戳 s
   *  @param {string} listQuerySelfFetch.sortBy - 排序字段
   *  @param {number} listQuerySelfFetch.endTime - 结束时间时间戳 s
   *  @param {number} listQuerySelfFetch.page -
   *  @param {number} listQuerySelfFetch.orderKdtId - 下单店铺
   *  @param {string} listQuerySelfFetch.subSortType -
   *  @return {Promise}
   */
  async exportSelfFetch(listQuerySelfFetch) {
    return this.invoke('exportSelfFetch', [listQuerySelfFetch]);
  }

  /**
   *  导出记录查询
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/516893
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

module.exports = PcSelfFetchService;
