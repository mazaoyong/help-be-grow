const BaseService = require('../base/BaseService');

/**
 * @typedef {import('../../../definitions/order/export-list').IFxListRes} IFxListRes
 */

/**
 * com.youzan.fx.trade.api.core.OrderExportService
 */
class OrderExportService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.fx.trade.api.core.OrderExportService';
  }

  /**
   *  分销采购单导出列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/43127
   *
   *  @param {Object} requestDTO - 导出列表请求参数
   *  @param {number} requestDTO.kdtId -
   *  @param {number} requestDTO.pageSize -
   *  @param {number} requestDTO.page -
   *  @return {Promise<IFxListRes>}
   */
  async queryList(requestDTO) {
    return this.invoke('queryList', [requestDTO]);
  }

  /**
   *  分销采购单导出接口
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/43126
   *
   *  @param {Object} requestDTO - 导出请求参数
   *  @param {number} requestDTO.kdtId -
   *  @param {string} requestDTO.nickName - 操作人名称
   *  @param {string} requestDTO.orderBy -
   *  @param {string} requestDTO.beginTime - 导出开始时间 yyyy-MM-dd HH:mm:ss
   *  @param {string} requestDTO.endTime - 导出结束时间 yyyy-MM-dd HH:mm:ss
   *  @param {string} requestDTO.account - 操作人账号
   *  @param {string} requestDTO.order -
   *  @return {Promise}
   */
  async export(requestDTO) {
    return this.invoke('export', [requestDTO]);
  }
}

module.exports = OrderExportService;
