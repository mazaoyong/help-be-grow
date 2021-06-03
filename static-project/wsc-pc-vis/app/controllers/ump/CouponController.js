const BaseController = require('../base/BaseController');
const CouponService = require('../../services/owl/pc/coupon/CouponService');

class CouponController extends BaseController {
  async findAllValidCouponListByKdtId(ctx) {
    const kdtId = ctx.kdtId;
    const { source } = ctx.query || {};
    const shopCouponQuery = {
      isSuperStore: ctx.getState('isSuperStore'),
      source,
    };

    const res = await new CouponService(ctx).findAllValidCouponListByKdtId(kdtId, shopCouponQuery);
    ctx.json(0, 'ok', res);
  }
}

module.exports = CouponController;
