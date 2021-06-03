const BaseController = require('../base/BaseController');
const ComponentService = require('../../services/retail/ComponentService');

class RetailController extends BaseController {
  getUserId(ctx) {
    return ctx.getLocalSession('userInfo').id;
  }
  // 获取优惠券列表
  async getCouponListJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.query || {};
    req.adminId = this.getUserId(ctx);
    req.kdtId = kdtId;

    const data = await new ComponentService(ctx).findCouponGroupList(req);
    ctx.json(0, 'ok', data);
  }
  // 获取优惠券
  async getCouponJson(ctx) {
    const kdtId = ctx.kdtId;
    const req = ctx.request.body || {};
    req.adminId = this.getUserId(ctx);
    req.kdtId = kdtId;

    const data = await new ComponentService(ctx).getsCouponGroup(req);
    ctx.json(0, 'ok', data);
  }
}

module.exports = RetailController;
