const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.invoice.query.InvoiceQueryService
 */
class InvoiceQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.invoice.query.InvoiceQueryService';
  }

  /**
   *  根据开票记录id查询开票记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/9993
   *
   *  @param {string} invoiceId -
   *  @param {object} paramOption -
   *  @param {boolean} paramOption.includeInvoiceHeader - 是否包含发票头
   *  @param {boolean} paramOption.includeInvoiceDetail - 是否包含发票详情
   *  @return {object}
   */
  async queryInvoiceById(invoiceId, paramOption) {
    return this.invoke('queryInvoiceById', [invoiceId, paramOption]);
  }

  /**
   *  根据订单号查询开票记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/75230
   *
   *  @param {string} bizNo -
   *  @param {Object} paramOption -
   *  @param {boolean} paramOption.includeInvoiceHeader - 是否包含发票头
   *  @param {boolean} paramOption.includeInvoiceDetail - 是否包含发票详情
   *  @return {Promise}
   */
  async queryInvoiceByBizNo(bizNo, paramOption) {
    return this.invoke('queryInvoiceByBizNo', [bizNo, paramOption]);
  }

  /**
   *  查询发票分页列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/11151
   *  @param {object} invoiceListQueryDTO -
   *  @param {number} invoiceListQueryDTO.headKdtId - 零售连锁版 总店 kdtId
   *  @param {number} invoiceListQueryDTO.kdtId -
   *  @param {number} invoiceListQueryDTO.invoiceStatusTypeCode - 红票/蓝票
   *  @param {number} invoiceListQueryDTO.invoiceStatusCode - 发票状态
   *  @param {boolean} invoiceListQueryDTO.isRedFreshed - 蓝票是否被红冲 当此项为true时，invoiceStatusTypeCode不能选择红票
   *  @param {string} invoiceListQueryDTO.invoiceHead - 发票抬头 例：杭州有赞科技有限公司
   *  @param {number} invoiceListQueryDTO.size -
   *  @param {string} invoiceListQueryDTO.invoiceId - 发票编号
   *  @param {number} invoiceListQueryDTO.startTime - 开票成功时间区间左边界 单位为秒
   *  @param {boolean} invoiceListQueryDTO.verifyValidness - 是否校验invalid字段 默认true, 即执行校验
   *  @param {number} invoiceListQueryDTO.endTime - 开票成功时间区间右边界 单位为秒
   *  @param {number} invoiceListQueryDTO.page -
   *  @param {string} invoiceListQueryDTO.invoiceNo - 发票号码
   *  @param {string} invoiceListQueryDTO.operatorId - 操作人员
   *  @return {Promise<any>}
   */
  async queryInvoicePaginatedList(invoiceListQueryDTO) {
    return this.invoke('queryInvoicePaginatedList', [invoiceListQueryDTO]);
  }
}

module.exports = InvoiceQueryService;
