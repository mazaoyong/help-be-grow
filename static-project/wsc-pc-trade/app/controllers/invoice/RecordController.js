const BaseController = require('./InvoiceBaseController');
const InvoiceOperateService = require('../../services/trade/invoice/InvoiceOperateService');
const InvoiceQueryService = require('../../services/trade/invoice/InvoiceQueryService');
const InvoiceSearchService = require('../../services/ebiz/InvoiceSearchService');
const utilsShop = require('@youzan/utils-shop');
const omitBy = require('lodash/omitBy');
const isNil = require('lodash/isNil');

/**
 * 发票记录
 */
class RecordController extends BaseController {
  get invoiceOperateService() {
    return this.getCacheService(InvoiceOperateService);
  }

  get invoiceQueryService() {
    return this.getCacheService(InvoiceQueryService);
  }

  get invoiceSearchService() {
    return this.getCacheService(InvoiceSearchService);
  }

  /**
   * 分页查询发票记录
   * @param {AstroboyContext} ctx
   */
  async invoiceList(ctx) {
    const shopInfo = ctx.getState('shopInfo');
    const selectKeys = ['invoiceStatusCode', 'invoiceStatusTypeCode', 'kdtId'];
    const query = ctx.getQueryData();
    const params = omitBy(
      query,
      (v, k) => isNil(v) || v === '' || (selectKeys.includes(k) && v === 'all'),
    );

    if (utilsShop.checkHqStore(shopInfo)) {
      params.headKdtId = shopInfo.rootKdtId;
    } else {
      // 非连锁总店 kdtId取店铺kdtId
      params.kdtId = ctx.kdtId;
      delete params.headKdtId;
    }

    const result = await this.invoiceSearchService.search(params);
    return ctx.successRes(result);
  }

  /**
   * 发票冲红
   * @param {AstroboyContext} ctx
   */
  async redInvoiceApply(ctx) {
    const { id } = ctx.getPostData();
    const result = await this.invoiceOperateService.redInvoiceApply({
      invoiceId: id,
      extension: {
        operator: this.operator,
      },
    });
    return ctx.successRes(result);
  }

  /**
   * 重试开票
   * @param {AstroboyContext} ctx
   */
  async retryInvoiceApply(ctx) {
    const { id } = ctx.getPostData();
    const result = await this.invoiceOperateService.retryInvoiceApply({
      invoiceId: id,
    });
    return ctx.successRes(result);
  }

  /**
   * 获取发票下载信息
   * @param {AstroboyContext} ctx
   */
  async invoiceDownload(ctx) {
    const { id } = ctx.getPostData();
    const result = await this.invoiceQueryService.queryInvoiceById(id, {
      includeInvoiceHeader: true,
      includeInvoiceDetail: true,
    });
    return ctx.successRes(result);
  }
}

module.exports = RecordController;
