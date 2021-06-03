const BaseController = require('../base/BaseNewController');
const ActivityService = require('../../services/owl/ump/core/ActivityService');

class ActivityController extends BaseController {
  /**
   * 根据用户的userId获取其分销员信息
   * @param {*} ctx
   */
  async getActivityJson(ctx) {
    const kdtId = ctx.kdtId || 0;
    const userId = ctx.buyerId || 0;
    const alias = ctx.query.alias;
    const params = {
      kdtId,
      userId,
      productAlias: alias,
    };

    let result = await new ActivityService(ctx).findByProduct([kdtId, params]);
    ctx.json(0, 'ok', result);
  }
}

module.exports = ActivityController;
