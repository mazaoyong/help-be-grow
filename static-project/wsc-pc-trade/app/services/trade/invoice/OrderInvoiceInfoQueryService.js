const BaseService = require('../../base/BaseService');

/**
 * com.youzan.trade.invoice.api.orderinvoiceinfo.OrderInvoiceInfoQueryService
 */
class OrderInvoiceInfoQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.trade.invoice.api.orderinvoiceinfo.OrderInvoiceInfoQueryService';
  }

  /**
   *  根据订单号查询该订单是否可以开票
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/79922
   *
   *  @param {string} bizNo - 订单号
   *  @param {object} queryParam - 查询附加条件 (可根据订单校验是否可开票)
   *  @param {boolean} queryParam.isCheckAllowInvoice -
   *  @return {Promise<any>}
   */
  async queryOrderInvoiceInfo(bizNo, queryParam) {
    return this.invoke('queryOrderInvoiceInfo', [bizNo, queryParam], {
      allowBigNumberInJSON: true,
    });
  }
}

module.exports = OrderInvoiceInfoQueryService;
