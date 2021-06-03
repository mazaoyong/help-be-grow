const PunchService = require('../../../services/punch/PunchService');

class PunchController {
  /**
   * 打卡区
   * 分页获取店铺下的所有打卡列表
   */
  async getAllPunchList(ctx) {
    const { kdtId, userId, query } = ctx;

    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = kdtId;
    query.userId = userId;

    const result = await new PunchService(ctx).getAllPunchList(query);
    ctx.json(0, 'ok', result);
  }
}

module.exports = PunchController;
