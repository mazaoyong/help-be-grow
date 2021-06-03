const BaseController = require('../base/BaseController');
const ShopRiskcontrolReadOuterService = require('../../services/shopcenter/outer/riskcontrol/ShopRiskcontrolReadOuterService');

class ShopRiskcontrolReadOuterController extends BaseController {
  // 查询店铺风控锁
  async queryShopFuncLock(ctx) {
    try {
      const kdtId = ctx.kdtId;
      const key = 'is_owl_create_lock';
      const data = await new ShopRiskcontrolReadOuterService(ctx).queryShopFuncLock(kdtId, key);
      return ctx.json(0, 'ok', data);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ShopRiskcontrolReadOuterController;
