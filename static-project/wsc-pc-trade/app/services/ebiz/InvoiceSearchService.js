const BaseService = require('../base/BaseService');

/**
 * com.youzan.ebiz.mall.trade.seller.api.service.search.InvoiceSearchService
 */
class InvoiceSearchService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.ebiz.mall.trade.seller.api.service.search.InvoiceSearchService';
  }

  /**
   *  用于发票列表检索,返回分页信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/236014
   *  @param {Object} invoiceSearchDTO - 发票搜索条件
   *  @param {number} invoiceSearchDTO.headKdtId - 零售连锁版 总店 kdtId
   *  @param {string} invoiceSearchDTO.orderNo - 订单编号 orderNo
   *  @param {number} invoiceSearchDTO.kdtId - 商铺id
   *  @param {number} invoiceSearchDTO.invoiceStatusTypeCode - 红票/蓝票
   *  @param {number} invoiceSearchDTO.invoiceStatusCode - 发票状态
   *  @param {string} invoiceSearchDTO.shopName - 店铺名称 shopName
   *  @param {number} invoiceSearchDTO.pageSize - 每页显示个数
   *  @param {string} invoiceSearchDTO.operator - 操作人员类型
   *  @param {boolean} invoiceSearchDTO.isRedFreshed - 蓝票是否被红冲 当此项为true时，invoiceStatusTypeCode不能选择红票
   *  @param {string} invoiceSearchDTO.invoiceHead - 发票抬头 例：杭州有赞科技有限公司
   *  @param {string} invoiceSearchDTO.taxPayerId - 纳税人识别号 简称税号
   *  @param {string} invoiceSearchDTO.invoiceId - 发票编号
   *  @param {number} invoiceSearchDTO.startTime - 开票成功时间区间左边界 单位为秒
   *  @param {boolean} invoiceSearchDTO.verifyValidness - 是否校验invalid字段 默认true, 即执行校验
   *  @param {number} invoiceSearchDTO.endTime - 开票成功时间区间右边界 单位为秒
   *  @param {number} invoiceSearchDTO.page - 当前页
   *  @param {string} invoiceSearchDTO.invoiceNo - 发票号码
   *  @param {string} invoiceSearchDTO.operatorId - 操作人员
   *  @return {Promise}
   */
  async search(invoiceSearchDTO) {
    return this.invoke('search', [invoiceSearchDTO]);
  }
}

module.exports = InvoiceSearchService;
