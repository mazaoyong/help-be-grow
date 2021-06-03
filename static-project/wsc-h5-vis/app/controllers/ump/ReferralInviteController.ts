import BaseController from '../base/BaseNewController';
import ReferralCustomerFacade from '../../services/api/owl/api/ReferralCustomerFacade';
import ClientEduProductFacade from '../../services/api/owl/api/ClientEduProductFacade';
import { Context } from 'astroboy';

class ReferralInviteController extends BaseController {
  async getIndexHtml() {
    await this.baseAcl({
      allowNotLogin: false,
      checkFansLogin: false,
      loginAjaxWithCode: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await this.getSalesmanInfo();
    await this.setGlobalTheme();
    await this.setPointsName();
    this.setSpm('recommendgift', this.ctx.kdtId);
    await this.ctx.render('ump/referral-invite.html');
  }

  /* 获取分销员信息 */
  async getSalesmanInfo() {
    const { alias } = this.ctx.params;
    try {
      await this.getShareIcon(this.ctx, alias);
    } catch (error) {
      this.ctx.visLogger.error('[getSalesmanInfo] error', error, {});
    }
  }

  /** @desciption 获取奖励轮播记录 */
  async getGetRewardCarouselJson(ctx: Context) {
    const result = await new ReferralCustomerFacade(ctx).getRewardCarousel(
      ctx.kdtId,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 根据商品alias查询活动详情 */
  async getGetDetailByGoodsAliasJson(ctx: Context) {
    const requestData = ctx.getRequestData();
    const goodsAlias: string = requestData.goodsAlias;

    const result = await new ReferralCustomerFacade(ctx).getDetailByGoodsAliasV2(
      ctx.kdtId,
      goodsAlias,
      ctx.userId,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 获取活动落地页推荐商品 */
  async getGetRecommendGoodsJson(ctx: Context) {
    const result = await new ReferralCustomerFacade(ctx).getRecommendGoods(
      ctx.kdtId,
    );
    ctx.json(0, 'ok', result);
  }

  /** @desciption 查询商品基本信息 */
  async getGetSimpleProductJson(ctx: Context) {
    const requestData = ctx.getRequestData();
    const alias: string = requestData.alias;

    const result = await new ClientEduProductFacade(ctx).getSimpleProduct(
      ctx.kdtId,
      alias,
    );
    ctx.json(0, 'ok', result);
  }

  /**
   * @description 获取收益总计
   */
  async getEarningsTotalJson(ctx: Context) {
    const requestData = ctx.getRequestData();
    const activityId: number = requestData.activityId;

    const result = await new ReferralCustomerFacade(ctx).getEarningsTotal(
      ctx.kdtId,
      activityId,
      ctx.userId,
    );

    ctx.json(0, 'ok', result);
  }

  /**
   * @description 获取收益明细
   */
  async getEarningsHistoryJson(ctx: Context) {
    const requestData = ctx.getQueryParse();
    const pageRequest = requestData.pageRequest;
    const queryDTO = {
      activityId: requestData.activityId,
      userId: ctx.userId,
    };
    const result = await new ReferralCustomerFacade(ctx).getEarningsHistory(
      ctx.kdtId,
      pageRequest,
      queryDTO,
    );

    ctx.json(0, 'ok', result);
  }

  /**
   * @description 获取我的邀请记录
   */
  async getInviteRecordJson(ctx:Context) {
    const requestData = ctx.getQueryParse();
    const activityId: number = requestData.activityId;
    const pageRequest = requestData.pageRequest;

    const result = await new ReferralCustomerFacade(ctx).getInvitedRecordByActivityId(
      ctx.kdtId,
      pageRequest,
      activityId,
      ctx.userId,
    );

    ctx.json(0, 'ok', result);
  }
}

export = ReferralInviteController;
