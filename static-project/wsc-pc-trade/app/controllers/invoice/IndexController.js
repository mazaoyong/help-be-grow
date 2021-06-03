const BaseController = require('./InvoiceBaseController');
const SellerInvoiceInfoQueryService = require('../../services/trade/invoice/SellerInvoiceInfoQueryService');
const FileUploadService = require('../../services/trade/invoice/FileUploadService');
const InvoiceSwitchService = require('../../services/trade/invoice/InvoiceSwitchService');
const HQStoreSearchService = require('../../services/retail/HQStoreSearchService');
const InvoiceAuthorizeRelationQuery = require('../../services/trade/invoice/InvoiceAuthorizeRelationQueryService');
const ActivationCodeRemoteService = require('../../services/yop/ActivationCodeRemoteService');

const utilsShop = require('@youzan/utils-shop');
const ShopType = require('../../constants/ShopType');
const { matchGrayConfig } = require('../../lib/utils');

class IndexController extends BaseController {
  /**
   * 电子发票 HTML 页面
   * @param {AstroboyContext} ctx
   */
  async getIndexHtml(ctx) {
    const { kdtId } = ctx;
    // 获取店铺自己的电子发票资产信息和设置信息
    let invoiceAsset = await this.sellerInvoiceInfoQueryService.queryActiveInvoiceAssetByKdtId(
      kdtId,
    );
    let invoiceSetting = await this.sellerInvoiceInfoQueryService.queryInvoiceSettingByKdtId(
      kdtId,
      {
        needLastedFileUrl: true,
      },
    );

    // 店铺没有自己的资产，则通过授权关系查询授权店铺的资产
    if (!invoiceAsset) {
      // 查询店铺授权关系
      const invoiceRelation = await this.invoiceAuthorizeRelationQueryService.getInvoiceAuthorizer({
        authorizedKdtId: kdtId,
      });
      if (invoiceRelation && invoiceRelation.kdtId) {
        // 查询授权店铺的资产
        invoiceAsset = await this.sellerInvoiceInfoQueryService.queryActiveInvoiceAssetByKdtId(
          invoiceRelation.kdtId,
        );
        invoiceSetting = await this.sellerInvoiceInfoQueryService.queryInvoiceSettingByKdtId(
          invoiceRelation.kdtId,
          {
            needLastedFileUrl: true,
          },
        );
      }
    }

    const shopInfo = ctx.getState('shopInfo');

    const isWscBranchStore = utilsShop.checkWscBranchStore(shopInfo);
    const isNotRetail = ctx.shopType !== ShopType.Retail; // 非零售店铺
    const isRetail3 = utilsShop.checkUnifiedShop(shopInfo); // 零售3.0模型
    // 非3.0零售，是单店或连锁总部时可以购买插件
    const canOldRetailBuyServe =
      !isRetail3 &&
      (utilsShop.checkRetailSingleStore(shopInfo) || utilsShop.checkHqStore(shopInfo));
    // 3.0零售，是总部店铺时可以购买插件
    const canNewRetailBuyServe = isRetail3 && utilsShop.checkUnifiedHqStore(shopInfo);
    // 店铺没有资产时，判断是否能购买服务，若能则跳转到购买页
    if (
      (!invoiceAsset || typeof invoiceAsset.status === 'undefined') && // 没有资产
      ((isNotRetail && !isWscBranchStore) || canOldRetailBuyServe || canNewRetailBuyServe)
    ) {
      const redirectUrl = ctx
        .getState('URL')
        .site(`/appmarket/appdesc?id=${this.APP_ID}`, 'www', ctx.isSuperStore);
      ctx.redirect(redirectUrl);
    }

    ctx.setGlobal({
      invoiceAsset,
      invoiceSetting,
    });

    const apolloClient = this.ctx.apolloClient;
    let whitelistConfig = '';
    try {
      whitelistConfig = apolloClient.getConfig({
        appId: 'wsc-pc-trade',
        namespace: 'wsc-pc-trade.whitelist',
        key: 'useGoodsSelectV2',
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
    const useGoodsSelectV2 = matchGrayConfig(whitelistConfig, this.ctx.kdtId);
    this.ctx.setGlobal({
      useGoodsSelectV2,
    });
    return ctx.render('invoice/index.html');
  }

  get fileUploadService() {
    return this.getCacheService(FileUploadService);
  }

  get HQStoreSearchService() {
    return this.getCacheService(HQStoreSearchService);
  }

  get invoiceSwitchService() {
    return this.getCacheService(InvoiceSwitchService);
  }

  get activationCodeRemoteService() {
    return this.getCacheService(ActivationCodeRemoteService);
  }

  get sellerInvoiceInfoQueryService() {
    return this.getCacheService(SellerInvoiceInfoQueryService);
  }

  get invoiceAuthorizeRelationQueryService() {
    return this.getCacheService(InvoiceAuthorizeRelationQuery);
  }

  /**
   * 启用服务
   * 有资产店铺可用
   * @param {AstroboyContext} ctx
   */
  async openInvoiceService(ctx) {
    const { kdtId, userId } = this.ctx;
    const result = await this.invoiceSwitchService.openInvoiceService(kdtId, userId);
    return ctx.successRes(result);
  }

  /**
   * 停止服务
   * 有资产店铺可用
   * @param {AstroboyContext} ctx
   */
  async closeInvoiceService(ctx) {
    const { kdtId, userId } = this.ctx;
    const result = await this.invoiceSwitchService.closeInvoiceService(kdtId, userId);
    return ctx.successRes(result);
  }

  /**
   * 查询电子发票插件是否开启
   * 没有资产的店铺也需要使用
   * @param {AstroboyContext} ctx
   */
  async isInvoiceServiceOpening(ctx) {
    const { kdtId } = ctx.originQuery || ctx; // safe done
    const result = await this.invoiceSwitchService.isInvoiceServiceOpening(kdtId);
    return ctx.successRes(result);
  }

  /**
   * 获取图片上传 Token
   * @param {AstroboyContext} ctx
   */
  async pictureUploadToken(ctx) {
    const result = await this.fileUploadService.getPictureUploadTokenByKdtId(ctx.kdtId);
    return ctx.successRes(result);
  }

  /**
   * 获取文件上传 Token
   * @param {AstroboyContext} ctx
   */
  async fileUploadToken(ctx) {
    const result = await this.fileUploadService.getFileUploadTokenByKdtId(ctx.kdtId);
    return ctx.successRes(result);
  }

  /**
   * 获取分店列表
   * @param {AstroboyContext} ctx
   */
  async kdtList(ctx) {
    const { userId: adminId } = ctx;
    const { kdtId } = ctx.originQuery || ctx; // safe done
    const baseParams = {
      kdtId,
      adminId,
      retailSource: 'invoice',
      pageSize: 100,
    };
    const param = { ...baseParams, pageNo: 1 };
    const firstResult = await this.HQStoreSearchService.search(param);
    let currentSum = firstResult.items.length;
    let result = firstResult.items;
    const totalCount = firstResult.paginator.totalCount;
    if (currentSum < totalCount) {
      param.pageNo++;
      const partResult = await this.HQStoreSearchService.search(param);
      result = result.concat(partResult.items);
      currentSum += partResult.items.length;
    }
    return ctx.successRes(result);
  }

  /**
   * 兑换激活码（门店添加资产）
   * @param {AstroboyContext} ctx
   */
  async checkCodeForNew(ctx) {
    const { kdtId, userId, firstXff: ip } = ctx;
    const { activationCode } = ctx.getPostData();
    const params = {
      kdtId,
      userId,
      ip,
      activationCode,
    };
    await this.activationCodeRemoteService.checkCodeForNew(params);
    const result = await this.activationCodeRemoteService.codeApply(params);
    ctx.successRes(result);
  }
}

module.exports = IndexController;
