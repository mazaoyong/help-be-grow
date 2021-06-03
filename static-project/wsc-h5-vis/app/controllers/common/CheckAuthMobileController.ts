import { Context } from 'astroboy';
import BaseController from '../base/BaseController';
import AppConfigRemoteService from '../../services/api/yop/AppConfigRemoteService';
import MobileUserService from '../../services/api/uic/MobileUserService';

class CheckAuthMobileController extends BaseController {
  async init() {
    await super.init();
  }

  async platformAcl() {
    const isThirdApp = await this.ctx.isThirdApp();
    if (isThirdApp) {
      await this.needPlatformAcl();
    }
  }

  // app开店处理
  async appShopConfig(ctx: Context) {
    const isThirdApp = await this.ctx.isThirdApp();

    ctx.setGlobal('isThirdApp', isThirdApp);

    if (isThirdApp) {
      // 一键授权
      // @ts-ignore
      const ua = ctx.getState('platformInfo.platformConfig.ua');
      if (ua) {
        try {
          const uaDetail = await new AppConfigRemoteService(ctx).getAppShopBasicInfo(ua);
          if (uaDetail && uaDetail.appShopName) {
            const { appShopName } = uaDetail;
            // 用于在手机号授权弹窗中展示三方app的名称
            ctx.setGlobal('appName', appShopName);
          }
        } catch (err) {
          ctx.logger.error('获取三方app 信息错误，', err);
        }
      }
    }
  }

  // 用户简单登录 文档https://doc.qima-inc.com/pages/viewpage.action?pageId=95420653
  async simpleLogin(ctx: Context) {
    const { buyer_id: buyerId, buyer } = ctx.getLocalSession();
    if (buyerId && buyer && JSON.stringify(buyer) !== '{}') {
      return;
    }
    try {
      const mobileUserService = new MobileUserService(ctx);
      const simpleLogin = await mobileUserService.checkNeedExternalLogin();
      ctx.setGlobal('simpleLogin', simpleLogin);
    } catch (e) {
      ctx.logger.warn('App开店跳转h5授权手机号获取simpleLogin异常', e, {
        buyerId,
        buyer,
      });
    }
  }

  async getIndexHtml(ctx: Context) {
    await ctx.render('common/checkAuthMobile.html');
  }
}

module.exports = CheckAuthMobileController;