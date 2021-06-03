const BaseController = require('../base/BaseController');
const SettingService = require('../../services/paidcontent/SettingService');
const AbilityReadService = require('../../services/shopcenter/shopprod/AbilityReadService');

class SettingController extends BaseController {
  async init() {
    await super.init();
    if (!this.ctx.acceptJSON) {
      await this.ctx.getAbilitiesByKeys(this.ctx, {
        namespaceId: 'course',
        businessId: 'wsc-pc-vis',
      });
    }
  }

  async getIndexHtml(ctx) {
    const { kdtId } = ctx;

    // 知识付费能力查询
    const abilityCode = 'paid_content_ability';
    const paidContentAbility = await new AbilityReadService(ctx)
      .queryShopAbilityInfo(kdtId, abilityCode)
      .catch(() => {});
    const paidContentAbilityStatus = (paidContentAbility || {}).abilityStatus;

    ctx.setGlobal('paidContentAbility', paidContentAbilityStatus);

    await ctx.render('paidcontent/settings/index.html');
  }

  // 查询设置列表
  async getListsJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.kdtId = kdtId;

    const res = await new SettingService(ctx).lists(req);

    ctx.json(0, 'ok', res);
  }

  // 更新设置开关
  async putSwitchJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.kdtId = kdtId;

    const res = await new SettingService(ctx).update(req);

    return ctx.json(0, 'ok', res);
  }
}

module.exports = SettingController;
