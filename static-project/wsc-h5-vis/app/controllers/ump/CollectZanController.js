const BaseController = require('../base/BaseNewController');
const CollectZanService = require('../../services/owl/ump/collectzan/CollectZanFacade');

class CollectZanController extends BaseController {
  async getIndexHtml(ctx) {
    this.setSpm('collectzan', 0);
    this.hideFooter();
    await this.baseAcl({
      forceOauthLogin: true,
      weixinOauthScope: 'snsapi_userinfo',
    });
    await this.setGlobalTheme();
    await ctx.render('ump/collect-zan.html', { title: '好友助力' });
  }

  /**
   * 创建点赞活动
   */
  async getBuildZanSetJson(ctx) {
    const { zanId, targetAlias, skuId = 0 } = ctx.query;
    let { fansId, fansType, buyerId } = this.buyer;

    const ret = await new CollectZanService(ctx)
      .buildZanSet(ctx.kdtId, {
        zanId,
        productAlias: targetAlias,
        fansId,
        fansType,
        adminId: buyerId,
        skuId: Number(skuId),
      });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 点赞详情
   */
  async getZanSetDetailJson(ctx) {
    const { zanSetAlias } = ctx.query;
    let { fansId, fansType, buyerId } = this.buyer;
    const ret = await new CollectZanService(ctx)
      .getZanSetDetail({
        zanSetAlias,
        fansId,
        fansType,
        adminId: buyerId,
      });
    ctx.json(0, 'ok', ret);
  }

  /**
   * 点赞
   */
  async getGivingZanJson(ctx) {
    const { zanId, zanSetId } = ctx.query;
    let { fansId, fansType, buyerId } = this.buyer;
    const ret = await new CollectZanService(ctx)
      .givingZan(ctx.kdtId, {
        zanId,
        zanSetId,
        fansId,
        fansType,
        adminId: buyerId,
      });
    ctx.json(0, 'ok', ret);
  }
}

module.exports = CollectZanController;
