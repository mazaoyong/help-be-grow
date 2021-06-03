const OrderBaseController = require('./OrderBaseController');
const PosterInstanceFacade = require('../../../services/owl/ump/poster/PosterInstanceFacade');
const ActivityRewardSnapshotFacade = require('../../../services/owl/ump/core/ActivityRewardSnapshotFacade');
const ParamsError = require('../../../exceptions/ParamsError');
const { isYouzanHost } = require('../../../utils/index');

class IndexController extends OrderBaseController {
  async initPage(ctx) {
    await this.baseAcl();

    const kdtId = ctx.kdtId;

    const [isYouzanSecuredObj, teamStatus] = await Promise.all([
      this.callService(
        'iron-base/shop.ShopConfigService',
        'getShopConfig',
        kdtId,
        'is_youzan_secured'
      ),
      this.callService(
        'iron-base/shop.TeamStatusService',
        'getTeamStatus',
        kdtId
      ),
    ]);

    const isYouzanSecured = isYouzanSecuredObj.is_youzan_secured;
    const isSecuredTransactions = teamStatus.is_secured_transactions;

    ctx.setGlobal('is_yz_guarantee', !isYouzanSecured ? 0 : +isYouzanSecured);
    ctx.setGlobal('is_secured_transactions', isSecuredTransactions);

    this.setSpm('trade', kdtId);

    this.hideFooter();
  }

  async getIndexHtml(ctx) {
    await this.initGlobalTheme();
    await this.setPointsName();
    await this.initPage(ctx);
    await ctx.render('trade/paid-content-order.html');
  }

  async getPosterHtml() {
    const ctx = this.ctx;
    await this.baseAcl({
      useAjaxLogin: true,
    });

    const { kdtId } = ctx;
    const { fansId, buyerId: userId } = this.buyer;
    const { bizId: instanceId, redirect = '' } = ctx.query;

    // 如果域名是全匹配，就直接放过
    if (isYouzanHost(redirect)) {
      await new PosterInstanceFacade(ctx).anonymousSub(kdtId, {
        fansId,
        instanceId,
        userId,
      });
      await ctx.redirect(redirect);
    } else {
      ctx.visLogger.warn('公众号海报传入的 redirectUrl 有误', '', {
        url: redirect,
      });
      throw new ParamsError(12345, '公众号海报传入的 redirectUrl 有误', {
        url: redirect,
      });
    }
  }

  async getCourseHtml(ctx) {
    await this.baseAcl({
      useAjaxLogin: true,
    });

    const { kdtId, appUrl } = ctx;
    const { fansId, buyerId: userId, fansType } = this.buyer;
    const { bizId, channel } = ctx.query;

    const result = await new ActivityRewardSnapshotFacade(ctx).getStatus(kdtId, {
      fansId,
      channel,
      bizId,
      userId,
      fansType,
    });

    if (result === 1) {
      ctx.redirect(`${appUrl.vis}/knowledge/index?page=mypay&kdt_id=${kdtId}`);
    } else {
      await ctx.render('trade/anonymous-course.html');
    }
  }
}

module.exports = IndexController;
