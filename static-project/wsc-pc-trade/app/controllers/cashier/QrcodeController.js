const BaseController = require('../base/BaseController');
const QrCodeQueryService = require('../../services/trade/business/qrcode/QrCodeQueryService');
const QrCodeCreateService = require('../../services/trade/business/qrcode/QrCodeCreateService');
const QrCodeUpdateService = require('../../services/trade/business/qrcode/QrCodeUpdateService');
const PurchaseService = require('../../services/multistore/PurchaseService');
const MultiStoreAdminService = require('../../services/multistore/MultiStoreAdminService');
const StoreReadService = require('../../services/multistore/StoreReadService');
const AuthenticationService = require('../../services/trade/business/AuthenticationService');
const MpVersionService = require('../../services/channel/MpVersionService');
const { checkOnlineBranchStore } = require('@youzan/utils-shop');
const { appName } = require('../../constants');
const { matchGrayConfig } = require('../../lib/utils');

class QrcodeController extends BaseController {
  async getIndexHtml(ctx) {
    const { kdtId } = ctx;
    const shopInfo = ctx.getState('shopInfo') || {};
    let weappStatusKdtId = kdtId;
    if (checkOnlineBranchStore(shopInfo)) {
      weappStatusKdtId = shopInfo.rootKdtId;
    }

    const [multiStorePluginVersion, authStatus] = await this.promiseAll([
      new PurchaseService(ctx).getPluginVersionByKdtId(kdtId),
      new AuthenticationService(ctx).queryAuthenticationStatus({
        kdtId,
        source: appName,
      }),
      this.initStoreId(),
      this.initTeamAdmin(),
      this.initIsShowMultiStore(),
      this.initWeappStatusInfo(weappStatusKdtId),
      this.initAlipayappStatusInfo(),
      this.getApolloConfigForGuideCashier(),
      this.getApolloConfig(),
    ]);

    await this.initWeappVersion(weappStatusKdtId);

    ctx.setGlobal('multiStorePluginVersion', multiStorePluginVersion);
    ctx.setGlobal('authStatus', authStatus);
    await ctx.render('cashier/index.html');
  }

  async getApolloConfig() {
    const apolloClient = this.ctx.apolloClient;
    const [whitelistConfig, aliapyappVersionRequirement] = await Promise.all([
      apolloClient.getConfig({
        appId: 'wsc-pc-trade',
        namespace: 'wsc-pc-trade.whitelist',
        key: 'alipayapp-qrcode',
      }),
      apolloClient.getConfig({
        appId: 'wsc-pc-trade',
        namespace: 'wsc-pc-trade.cashier',
        key: 'alipayapp-version-requirement',
      }),
    ]);
    const isShowAlipayAppQrcode = matchGrayConfig(whitelistConfig, this.ctx.kdtId);

    this.ctx.setGlobal({
      isShowAlipayAppQrcode,
      aliapyappVersionRequirement,
    });
  }

  async getApolloConfigForGuideCashier() {
    const apolloClient = this.ctx.apolloClient;
    const [whitelistConfig] = await Promise.all([
      apolloClient.getConfig({
        appId: 'wsc-pc-trade',
        namespace: 'wsc-pc-trade.whitelist',
        key: 'guide_cashier',
      }),
    ]);
    const isShowGuideQrcode = matchGrayConfig(whitelistConfig, this.ctx.kdtId);

    this.ctx.setGlobal({
      isShowGuideQrcode,
    });
  }

  async initAlipayappStatusInfo() {
    const alipayMpInfoData = await new MpVersionService(this.ctx).getMpVersion({
      accountType: 10,
      businessType: 1,
      kdtId: this.ctx.kdtId,
      bundleId: 'com.alipay.alipaywallet',
    });

    this.ctx.setGlobal('alipayMpInfoData', {
      releaseVersion: alipayMpInfoData.releaseVersion,
    });
  }

  /**
   * 获取扫码收款的二维码列表
   * @param {AstroboyContext} ctx
   */
  async getQrcodeList(ctx) {
    const { kdtId } = ctx;

    const query = {
      ...ctx.query,
      kdtId,
      // 1 时间降序 2时间升序
      pageOrderType: 2,
      // 是否需要优惠信息
      needPromotionInfo: true,
      // 是否需要分页
      needPaging: true,
      // 是否需要标签信息
      needLabelInfo: true,
    };
    if (query.qrTypes) {
      query.qrTypes = [query.qrTypes];
    }

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      query.kdtId = liteKdtId || kdtId;
    }

    const result = await new QrCodeQueryService(ctx).queryQrCodeList(query);

    ctx.json(0, 'ok', result);
  }

  /**
   * 获取二维码详情
   * @param {AstroboyContext} ctx
   */
  async queryQrCodeByQrId(ctx) {
    const { kdtId } = ctx;
    const query = {
      ...ctx.query,
      kdtId,
      needPromotionInfo: true,
      needLabelInfo: true,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      query.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodeQueryService(ctx).queryQrCodeByQrId(query);

    ctx.json(0, 'ok', result);
  }

  /**
   * 创建二维码
   * @param {AstroboyContext} ctx
   */
  async createQrCode(ctx) {
    const { kdtId } = ctx;
    const { shopId, ...rest } = ctx.request.body; // safe done 入参无 kdtId
    const query = {
      ...rest,
      shopInfoDTO: {
        kdtId,
        shopId,
      },
      // 来源 0 内部 1外部
      source: 0,
    };

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);

    if (isLite) {
      query.kdtId = liteKdtId || kdtId;
      query.shopInfoDTO.kdtId = liteKdtId || kdtId;
    }

    const result = await new QrCodeCreateService(ctx).createQrCode(query);

    ctx.json(0, 'ok', result);
  }

  /**
   * 编辑二维码信息
   * @param {AstroboyContext} ctx
   */
  async editQrCode(ctx) {
    const { kdtId, userId: operateId } = ctx;
    const query = {
      ...ctx.request.body,
      kdtId,
      operateId,
    };

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      query.kdtId = liteKdtId || kdtId;
    }

    const result = await new QrCodeUpdateService(ctx).editQrCode(query);

    ctx.json(0, 'ok', result);
  }

  /**
   * 删除二维码
   * @param {AstroboyContext} ctx
   */
  async deleteQrCode(ctx) {
    const { kdtId, userId } = ctx;

    const query = {
      ...ctx.request.body,
      kdtId,
      userId,
    };

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      query.kdtId = liteKdtId || kdtId;
    }
    const result = await new QrCodeUpdateService(ctx).deleteQrCode(query);
    ctx.json(0, 'ok', result);
  }

  /**
   * 获取网点列表，支持模糊查询
   * @param {*} ctx
   */
  async getStoreListFromES(ctx) {
    const { kdtId } = ctx;
    const query = {
      ...ctx.request.query,
      kdtId,
      isOnline: 1,
    };
    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      query.kdtId = liteKdtId || kdtId;
    }
    const data = await new StoreReadService(ctx).listStoreNamesPagedFromES(query);
    return ctx.json(0, 'success', data);
  }

  /**
   * 获取网点管理员，网点信息
   * @param {*} ctx
   */
  async getStoreAdminInfo(ctx) {
    const { kdtId, userId: adminId } = ctx;
    let realKdtId = kdtId;

    const { isLite, liteKdtId } = await this.getLiteStoreId(ctx);
    if (isLite) {
      realKdtId = liteKdtId || kdtId;
    }

    const data = await new MultiStoreAdminService(ctx).getStoreSimpleInfoByAdminIdAndKdtId(
      realKdtId,
      adminId,
    );

    return ctx.json(0, 'success', data);
  }
}

module.exports = QrcodeController;
