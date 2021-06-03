const BaseService = require('../base/BaseService');

class ShopFooterService extends BaseService {
  get defaultFooter() {
    return {
      nav: [],
      logoUrl: '',
      logoLink: 'https://www.youzan.com?from_source=support_logo',
      text: '有赞提供技术支持',
      hidePoweredBy: false,
      hideCopyright: false,
    };
  }

  /**
   * 获取店铺底部信息
   * nav 底部导航列表
   * logoUrl Logo 图片地址
   * logoLink 点击 Logo 跳转链接地址
   * text 技术支持文案，默认显示“有赞提供技术支持”
   */
  async getFooterInfo(kdtId, offlineId = 0) {
    const service = this.getService('iron-base', 'shop.ShopBaseReadService');
    const shopBaseInfo = await service.getShopBaseInfoByKdtId(kdtId);
    let result;
    if (shopBaseInfo.shopType === 1) {
      result = await this.getWxdFooter(kdtId, offlineId);
    } else {
      result = await this.getWscFooter(kdtId, offlineId);
    }
    return result;
  }

  // 微商城
  async getWscFooter(kdtId, offlineId) {
    const result = Object.assign({}, this.defaultFooter);

    const whitelistService = this.getService(
      'iron-base',
      'common.WhitelistService',
    );
    const shopBaseReadService = this.getService(
      'iron-base',
      'shop.ShopBaseReadService',
    );
    const shopSettingsService = this.getService(
      'iron-base',
      'shop.ShopSettingsService',
    );
    const shopConfigService = this.getService(
      'iron-base',
      'shop.ShopConfigService',
    );
    const appConfigRemoteService = this.getService(
      'iron-base',
      'yop.AppConfigRemoteService',
    );
    const mpAccountService = this.getService(
      'iron-base',
      'channels.MpAccountService',
    );

    const [
      shopBaseInfo,
      shopSettings,
      shopConfig,
      openAppConfig,
      hidePoweredBy,
      newhopeKdtIds,
      mpAccount,
    ] = await Promise.all([
      shopBaseReadService.getShopBaseInfoByKdtId(kdtId),
      shopSettingsService.getShopSettings(kdtId),
      shopConfigService.getShopConfig(kdtId, 'team_physical'),
      appConfigRemoteService.getAppConfigInfo(this.ctx.platform),
      whitelistService.exists('hidden_power_by', kdtId),
      whitelistService.get('ebiz_newhope_kdtids'), // 新希望店铺列表
      mpAccountService.getMpAccountByKdtId(kdtId),
    ]);

    const WapUrl = this.getLib('iron-base', 'WapUrl');
    const homepageUrl = WapUrl.getHomePageUrlByKdtId(kdtId);
    const usercenterUrl = WapUrl.getUserCenterUrlByKdtId(kdtId);
    const certUrl = WapUrl.getCertUrl(kdtId);
    // const recordUrl = WapUrl.getRecordUrlByKdtId(kdtId);

    // 是否显示底部导航
    let showFooterNav = shopBaseInfo.shopType !== 2 && [371761, 391658, 13770441, 15662592].indexOf(kdtId) === -1 &&
    !openAppConfig.hideFootNav;

    if (showFooterNav) {
      result.nav.push({ title: '店铺主页', link: homepageUrl });
      result.nav.push({ title: '会员中心', link: usercenterUrl });
      if (mpAccount && mpAccount.weixinAccount) {
        result.nav.push({
          title: '关注我们',
          link: '',
          className: 'js-open-follow',
        });
      }
      if (
        offlineId || (shopConfig.team_physical === '1' && (Array.isArray(newhopeKdtIds) && newhopeKdtIds.indexOf(kdtId) === -1))
      ) {
        if (offlineId) {
          result.nav.push({
            title: '其他分店',
            link: WapUrl.getMultistoreUrlByKdtId(kdtId),
          });
        }
        if (shopConfig.team_physical === '1') {
          result.nav.push({
            title: '线下门店',
            link: WapUrl.getPhysicalstoreUrlByKdtId(kdtId),
          });
        }
      }
      result.nav.push({ title: '店铺信息', link: certUrl });
    }

    // 叮当app临时特殊处理 TODO
    if (
      this.ctx.platform === 'c2a7b9269fd095fa5b1467769433688' || openAppConfig.hideCopyright
    ) {
      result.hideCopyright = true;
    }
    if (!result.hideCopyright) {
      if (shopSettings.isLogoCustomized) {
        result.logo_url = shopSettings.customizedLogo;
        result.logo_link = '';
      }
    }

    result.hidePoweredBy = hidePoweredBy;
    return result;
  }

  // 微小店
  async getWxdFooter(kdtId) {
    const WapUrl = this.getLib('iron-base', 'WapUrl');
    const homepageUrl = WapUrl.getHomePageUrlByKdtId(kdtId);
    const recordUrl = WapUrl.getRecordUrlByKdtId(kdtId);
    const result = Object.assign({}, this.defaultFooter);
    result.nav.push({ title: '小店首页', link: homepageUrl });
    result.nav.push({ title: '购物记录', link: recordUrl });

    return result;
  }
}

module.exports = ShopFooterService;
