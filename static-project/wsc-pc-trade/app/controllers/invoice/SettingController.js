const BaseController = require('./InvoiceBaseController');
const SellerInfoOperateService = require('../../services/trade/invoice/SellerInfoOperateService');
const InvoiceAuthorizeRelationQuery = require('../../services/trade/invoice/InvoiceAuthorizeRelationQueryService');
const InvoiceService = require('../../services/retail/InvoiceService');
const InvoiceSearchService = require('../../services/ebiz/InvoiceSearchService');
const InvoiceToGrantAuthorizationService = require('../../services/trade/invoice/InvoiceToGrantAuthorizationService');

/**
 * 发票设置
 */
class SettingController extends BaseController {
  get sellerInfoOperateService() {
    return this.getCacheService(SellerInfoOperateService);
  }

  get invoiceAuthorizeRelationQueryService() {
    return this.getCacheService(InvoiceAuthorizeRelationQuery);
  }

  get invoiceService() {
    return this.getCacheService(InvoiceService);
  }

  get invoiceSearchService() {
    return this.getCacheService(InvoiceSearchService);
  }

  get grantAuthorizationService() {
    return this.getCacheService(InvoiceToGrantAuthorizationService);
  }

  /**
   * 修改开票信息
   * @param {AstroboyContext} ctx
   */
  async modifyTaxOfficerInfoAndSetting(ctx) {
    const { kdtId } = ctx;
    const postData = ctx.getPostData();
    const result = await this.sellerInfoOperateService.modifyTaxOfficerInfoAndSetting({
      ...postData,
      kdtId,
    });
    return ctx.successRes(result);
  }

  /**
   * 修改开票主体信息 - 通过审核后
   * @param {Context} ctx
   */
  async modifyInvoiceSetting(ctx) {
    const { kdtId } = ctx;
    const postData = ctx.getPostData();
    const result = await this.sellerInfoOperateService.modifyInvoiceSetting({
      ...postData,
      kdtId,
    });

    return ctx.successRes(result);
  }

  /**
   * 查询授权店铺列表（开票门店）
   * @param {AstroboyContext} ctx
   */
  async getAuthorizedRelation(ctx) {
    const { kdtId } = ctx;
    const result = await this.invoiceAuthorizeRelationQueryService.getAuthorizedRelation({ kdtId });
    return ctx.successRes(result);
  }

  /**
   * 查询某个店铺的被授权关系
   * @param {AstroboyContext} ctx
   */
  async getInvoiceAuthorizer(ctx) {
    const { kdtId } = ctx.originQuery || ctx; // safe done
    const result = await this.invoiceAuthorizeRelationQueryService.getInvoiceAuthorizer({
      authorizedKdtId: kdtId,
    });
    return ctx.successRes(result);
  }

  /**
   * 发票服务授权（更新管理门店）
   * @param {AstroboyContext} ctx
   */
  async authInvoiceByKdtId(ctx) {
    const { kdtId, userId } = ctx;
    const data = ctx.getPostData();
    const result = await this.invoiceService.authInvoiceByKdtId({
      ...data,
      kdtId,
      adminId: userId,
    });
    return ctx.successRes(result);
  }

  /**
   * 发票服务解除授权（更新管理门店）
   * @param {AstroboyContext} ctx
   */
  async deleteInvoiceAuthByKdtId(ctx) {
    const { kdtId, userId } = ctx;
    const data = ctx.getPostData();
    const result = await this.invoiceService.deleteInvoiceAuthByKdtId({
      ...data,
      kdtId,
      adminId: userId,
    });
    return ctx.successRes(result);
  }

  /**
   * 微商城连锁发票服务授权
   * @param {AstroboyContext} ctx
   */
  async invoiceAuthorization(ctx) {
    const { kdtId } = ctx;
    const { authKdtIdList } = ctx.getPostData();
    const result = await this.grantAuthorizationService.invoiceAuthorization(
      authKdtIdList,
      kdtId,
      this.operator.operatorId,
    );
    return ctx.successRes(result);
  }

  /**
   * 微商城连锁发票服务解除授权
   * @param {AstroboyContext} ctx
   */
  async relieveOneRelation(ctx) {
    const { kdtId } = ctx;
    const { authKdtIdList } = ctx.getPostData();
    const result = await this.grantAuthorizationService.relieveOneRelation(
      authKdtIdList[0],
      kdtId,
      this.operator.operatorId,
    );
    return ctx.successRes(result);
  }

  /**
   * 获取已开发票数
   * @param {AstroboyContext} ctx
   */
  async getInvoicedTicketNum(ctx) {
    const query = ctx.getQueryData();
    const result = await this.invoiceSearchService.search({
      ...query,
      kdtId: ctx.originQuery.kdtId || ctx.kdtId // safe done
    });
    return ctx.successRes(result.totalItems || 0);
  }
}

module.exports = SettingController;
