const BaseController = require('../base/BaseNewController');

class RenderController extends BaseController {
  // 优惠套餐活动页
  async renderPackageBuyHtml(ctx) {
    const { kdtId } = ctx;
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });

    // 进店逻辑
    const { activityAlias } = ctx.getQueryParse();
    await this.autoEnterUmpCampusInfo('packagebuy', activityAlias);

    this.setSpm('visPackageBuy', kdtId);
    await this.setGlobalTheme();
    await ctx.render('ump/package-buy.html');
  }

  // 领取赠品页
  async getReceivePresentHtml(ctx) {
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await this.setGlobalTheme();
    // 环境信息
    const env = {
      platform: ctx.platform,
      isWeixin: ctx.isWeixin,
      isSwanApp: ctx.isSwanApp,
      isWeapp: ctx.isWeapp,
      isThirdApp: ctx.isThirdApp(ctx.platform),
      theme: ctx.getState('globalTheme'),
    };
    ctx.setGlobal({
      env,
    });
    await ctx.render('ump/receive-present.html');
  }

  // 活动中心页面
  async renderActivityEntryHtml(ctx) {
    // 环境信息
    const env = {
      platform: ctx.platform,
      isWeixin: ctx.isWeixin,
      isSwanApp: ctx.isSwanApp,
      isWeapp: ctx.isWeapp,
      isThirdApp: ctx.isThirdApp(ctx.platform),
      theme: ctx.getState('globalTheme'),
    };
    ctx.setGlobal({
      env,
    });
    await ctx.render('ump/activity-entry.html');
  }
}

module.exports = RenderController;
