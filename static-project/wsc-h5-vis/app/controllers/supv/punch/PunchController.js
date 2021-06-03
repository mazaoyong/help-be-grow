const PunchService = require('../../../services/punch/PunchService');

class PunchController {
  /**
   * 打卡区
   * 分页获取店铺下的所有打卡列表
   */
  async getAllPunchList(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;

    const result = await new PunchService(ctx).getAllPunchList(query);
    ctx.json(0, 'ok', result);
  }

  /**
   * 已购列表
   */
  async getBoughtList(ctx) {
    const { userId, kdtId, query } = ctx;
    const session = ctx.getLocalSession() || {};
    const list = await new PunchService(ctx).getBoughtList({
      userId,
      fansId: session.fans_id || 0,
      fansType: session.fans_type || 0,
      kdtId,
      page: query.page,
      size: query.size,
      fromSource: ctx.isWeapp ? 1 : 2,
    });
    ctx.json(0, 'ok', list);
  }

  /**
   * 微页面列表
   */
  async getFeatureList(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;

    const list = await new PunchService(ctx).getFeatureList(query);
    ctx.json(0, 'ok', list);
  }

  /**
   * @deprecated
   * 批量判断专栏是否已关联打卡
   */
  async getSupportPunches(ctx) {
    const { columnAliases } = ctx.request.body;
    const rst = await new PunchService(ctx).getSupportPunch(ctx.kdtId, columnAliases);
    ctx.json(0, 'ok', rst);
  }

  /**
   * 判断专栏是否已关联打卡
   */
  async getSupportPunch(ctx) {
    const { columnAlias } = ctx.query;
    const { userId } = ctx;
    const session = ctx.getLocalSession() || {};
    const fansId = session.fans_id || 0;
    const fansType = session.fans_type || 0;
    const rst = await new PunchService(ctx).getGciInfoByColumnAlias(ctx.kdtId, {
      userId,
      fansId,
      fansType,
      columnAlias,
    });
    ctx.json(0, 'ok', rst);
  }

  async getPunchDetailByAlias(ctx) {
    const { kdtId } = ctx;
    const { alias } = ctx.query;
    const result = await new PunchService(ctx).getPunchDetailByAlias([kdtId, alias]);
    ctx.json(0, 'ok', result);
  }

  async getIntroDesc(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const { alias } = ctx.query;
    const session = ctx.getLocalSession() || {};
    const fansId = session.fans_id || 0;
    const fansType = session.fans_type || 0;
    const dto = {
      fansId,
      kdtId: Number(kdtId),
      alias,
      userId,
      fansType,
    };
    const result = await new PunchService(ctx).getIntroDesc([dto]);
    ctx.json(0, 'ok', result);
  }

  async getColumn(ctx) {
    const { kdtId } = ctx;
    const { columnAlias } = ctx.query;
    const queryArr = [kdtId, columnAlias];
    const result = await new PunchService(ctx).getColumn(queryArr);
    ctx.json(0, 'ok', result);
  }

  async postValidatePassword(ctx) {
    const { kdtId } = ctx;
    const { alias, password } = ctx.request.body;
    const queryArr = [kdtId, alias, password];
    const result = await new PunchService(ctx).postValidatePassword(queryArr);
    ctx.json(0, 'ok', result);
  }

  async postAddPunchData(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const { dto } = ctx.request.body;
    const dtoObj = dto;
    const session = ctx.getLocalSession() || {};
    dtoObj.kdtId = Number(kdtId) || 0;
    dtoObj.userId = userId || 0;
    dtoObj.fansId = session.fans_id || 0;
    dtoObj.fansType = session.fans_type || 0;
    const result = await new PunchService(ctx).postAddPunchData([dtoObj]);
    ctx.json(0, 'ok', result);
  }

  async uploadMaterialToken(ctx) {
    const { dto } = ctx.query;
    const dtoObj = JSON.parse(dto);
    const result = await new PunchService(ctx).uploadMaterialToken([dtoObj]);
    ctx.json(0, 'ok', result);
  }

  async getCalenderDetail(ctx) {
    const { gciDetailRequestDTOobject, alias = '', taskDate = '' } = ctx.query;
    let query = {};
    if (alias) {
      query.alias = alias;
      query.taskDate = taskDate;
    } else {
      try {
        query = JSON.parse(gciDetailRequestDTOobject);
      } catch (err) {}
    }
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.userId = ctx.userId || 0;
    query.kdtId = ctx.kdtId || 0;
    const result = await new PunchService(ctx).getCalenderDetail([query]);
    ctx.json(0, 'ok', result);
  }

  async generateUser(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const query = ctx.request.body;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.userId = userId;
    query.kdtId = Number(kdtId);
    const result = await new PunchService(ctx).generateUser([query]);
    ctx.json(0, 'ok', result);
  }

  async getPersonRank(ctx) {
    const { userId, kdtId, query } = ctx;
    const { dto } = query;
    const dtoObj = JSON.parse(dto);
    const session = ctx.getLocalSession() || {};
    dtoObj.fansId = session.fans_id || 0;
    dtoObj.fansType = session.fans_type || 0;
    dtoObj.userId = userId;
    dtoObj.kdtId = kdtId;
    const result = await new PunchService(ctx).getPersonRank([dtoObj]);
    ctx.json(0, 'ok', result);
  }

  async getRankList(ctx) {
    const { kdtId, query } = ctx;
    const { dto } = query;
    const dtoObj = JSON.parse(dto);
    dtoObj.kdtId = kdtId;
    const result = await new PunchService(ctx).getRankList([dtoObj]);
    ctx.json(0, 'ok', result);
  }
}

module.exports = PunchController;
