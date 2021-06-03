const DiaryService = require('../../../services/punch/DiaryService');

class DiaryController {
  /**
   * 获取日记列表
   */
  async getDiaryList(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = ctx.kdtId;
    query.userId = ctx.userId;

    const list = await new DiaryService(ctx).getDiaryList(query);
    ctx.json(0, 'ok', list);
  }

  async getDiary(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = ctx.kdtId;
    query.userId = ctx.userId;

    const result = await new DiaryService(ctx).getDiary(query);
    ctx.json(0, 'ok', result);
  }

  async getMyGciLog(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const {
      gciId,
      taskId,
    } = ctx.query;
    const session = ctx.getLocalSession() || {};
    const fansId = session.fans_id || 0;
    const fansType = session.fans_type || 0;
    const dto = {
      gciId,
      fansId,
      kdtId,
      userId,
      taskId,
      fansType,
    };

    const result = await new DiaryService(ctx).getMyGciLog([dto]);
    ctx.json(0, 'ok', result);
  }

  async postUpdatePunchData(ctx) {
    const { kdtId, buyerId: userId } = ctx;
    const { dto } = ctx.request.body;
    const dtoObj = dto;
    const session = ctx.getLocalSession() || {};
    dtoObj.kdtId = kdtId;
    dtoObj.userId = userId;
    dtoObj.fansId = session.fans_id || 0;
    dtoObj.fansType = session.fans_type || 0;

    const result = await new DiaryService(ctx).postUpdatePunchData([dtoObj]);
    ctx.json(0, 'ok', result);
  }

  async getLikeList(ctx) {
    const { query, kdtId, userId } = ctx;
    query.kdtId = kdtId;
    query.userId = userId;

    const list = await new DiaryService(ctx).getPraiseList(query);
    ctx.json(0, 'ok', list);
  }

  async postLike(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = ctx.kdtId;
    query.userId = ctx.userId;

    const rst = await new DiaryService(ctx).postPraise(query);
    ctx.json(0, 'ok', rst);
  }

  async postCancelLike(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = ctx.kdtId;
    query.userId = ctx.userId;

    const rst = await new DiaryService(ctx).postUnPraise(query);
    ctx.json(0, 'ok', rst);
  }

  async postComment(ctx) {
    const { kdtId, userId } = ctx;
    const query = ctx.request.body;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = kdtId;
    query.userId = userId;
    const rst = await new DiaryService(ctx).postComment(query);
    ctx.json(0, 'ok', rst);
  }

  async postCommentOnDiary(ctx) {
    const query = ctx.request.body;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = ctx.kdtId;
    query.userId = ctx.userId;

    if (!query.commentId) delete query.commentId;

    const rst = await new DiaryService(ctx).postCommentOnDiary(query);
    ctx.json(0, 'ok', rst);
  }

  async deleteComment(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    const rst = await new DiaryService(ctx).deleteComment(query);
    ctx.json(0, 'ok', rst);
  }

  async getStudentsComments(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.userId = ctx.userId;
    query.kdtId = ctx.kdtId;
    const list = await new DiaryService(ctx).getStudentsComments(query);
    ctx.json(0, 'ok', list);
  }

  async getTeacherComments(ctx) {
    const { query, userId, kdtId } = ctx;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = kdtId;
    query.userId = userId;
    const list = await new DiaryService(ctx).getTeacherComments(query);
    ctx.json(0, 'ok', list);
  }
}

module.exports = DiaryController;
