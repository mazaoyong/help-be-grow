const PunchService = require('../../../services/punch/PunchService');

class RankController {
  async getPersonRank(ctx) {
    const { userId, kdtId, query } = ctx;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.userId = userId;
    query.kdtId = kdtId;
    const result = await new PunchService(ctx).getPersonRank([query]);
    ctx.json(0, 'ok', result);
  }

  async getRankList(ctx) {
    const { kdtId, query } = ctx;
    query.kdtId = kdtId;
    const result = await new PunchService(ctx).getRankList([query]);
    ctx.json(0, 'ok', result);
  }
}

module.exports = RankController;
