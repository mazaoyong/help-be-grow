const BaseController = require('../base/BaseController');
const AbilityReadService = require('../../services/shopcenter/shopprod/AbilityReadService');

class AbilityReadController extends BaseController {
  // 查询店铺能力
  async getShopAbilityJson(ctx) {
    const kdtId = ctx.kdtId;
    const { abilityCode } = ctx.request.query || {};

    this.validator.required(kdtId, '参数 kdt_id 不能为空');
    this.validator.required(abilityCode, '参数 abilityCode 不能为空');

    const data = await new AbilityReadService(ctx).queryShopAbilityInfo(kdtId, abilityCode);

    return ctx.json(0, 'ok', data);
  }
}

module.exports = AbilityReadController;
