const BaseController = require('./InvoiceBaseController');
const SellerInvoiceInfoQueryService = require('../../services/trade/invoice/SellerInvoiceInfoQueryService');
const SubscribeInvoiceFlowService = require('../../services/trade/invoice/SubscribeInvoiceFlowService');

class SetupController extends BaseController {
  get sellerInvoiceInfoQueryService() {
    return this.getCacheService(SellerInvoiceInfoQueryService);
  }

  get subscribeInvoiceFlowService() {
    return this.getCacheService(SubscribeInvoiceFlowService);
  }

  /**
   * 初次提交电子发票设置信息
   * @param {AstroboyContext} ctx
   */
  async applyEnterpriseInfo(ctx) {
    const postData = ctx.getPostData();
    const { kdtId } = this.ctx;
    const result = await this.subscribeInvoiceFlowService.applyEnterpriseInfo({
      ...postData,
      kdtId,
    });
    return ctx.successRes(result);
  }

  /**
   * 重新提交电子发票设置信息
   * @param {AstroboyContext} ctx
   */
  async reSubmitEnterpriseInfo(ctx) {
    const postData = ctx.getPostData();
    const { kdtId } = this.ctx;
    const result = await this.subscribeInvoiceFlowService.reSubmitEnterpriseInfo({
      ...postData,
      kdtId,
    });
    return ctx.successRes(result);
  }

  /**
   * 提交三方证书相关信息
   * @param {AstroboyContext} ctx
   */
  async applyTripartiteCertificate(ctx) {
    const { kdtId } = ctx;
    const postData = { ...ctx.getPostData(), kdtId };
    const result = await this.subscribeInvoiceFlowService.applyTripartiteCertificate(postData);
    return ctx.successRes(result);
  }

  /**
   * 完成分类编码配置，进入下一阶段
   * @param {AstroboyContext} ctx
   */
  async configuredTaxClassCode(ctx) {
    const { kdtId } = ctx;
    const result = await this.subscribeInvoiceFlowService.configuredTaxClassCode({ kdtId });
    return ctx.successRes(result);
  }

  /**
   * 卖家发票资产更新status至40，完成部署税控设备，进入下一阶段
   * @param {AstroboyContext} ctx
   */
  async confirmInvoiceAccount(ctx) {
    const { kdtId } = ctx;
    const result = await this.subscribeInvoiceFlowService.confirmInvoiceAccount(kdtId);
    return ctx.successRes(result);
  }
}

module.exports = SetupController;
