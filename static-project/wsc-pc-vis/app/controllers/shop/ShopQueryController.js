const BaseController = require('../base/BaseController');
const ShopQueryService = require('../../services/owl/pc/shop/ShopQueryService');

class ShopQueryController extends BaseController {
  // 获取连锁总部下面所有的子店铺
  async findListAllCampus(ctx) {
    const { kdtId } = ctx;

    const res = await new ShopQueryService(ctx).findListAllCampus(kdtId);

    ctx.json(0, 'ok', res);
  }

  /**
   * 获取分校区（分店）列表
   */
  async findPageAllCampus(ctx) {
    const { kdtId } = ctx;
    const { shopCampusQuery, pageRequest } = ctx.getQueryParse() || {};
    if (!shopCampusQuery['hqKdtId']) {
      shopCampusQuery['hqKdtId'] = kdtId;
    }
    const resp = await new ShopQueryService(ctx).findPageAllCampus(shopCampusQuery, pageRequest);
    return ctx.json(0, 'ok', resp);
  }
}

module.exports = ShopQueryController;
