const TaskService = require('../../../services/punch/TaskService');

class TaskController {
  async getTaskDetail(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;
    query.kdtId = ctx.kdtId;

    const queryData = {
      ...query,
      userId: ctx.userId,
    };
    const result = await new TaskService(ctx).getTaskDetail(queryData);
    ctx.json(0, 'ok', result);
  }

  async getShareCardInfo(ctx) {
    const query = ctx.query;
    const session = ctx.getLocalSession() || {};
    query.fansId = session.fans_id || 0;
    query.fansType = session.fans_type || 0;

    const queryData = {
      ...query,
      kdtId: ctx.kdtId,
      userId: ctx.userId,
    };

    const result = await new TaskService(ctx).getShareCardInfo(queryData);
    ctx.json(0, 'ok', result);
  }

  async getTaskContent(ctx) {
    const { kdtId } = ctx;
    const { taskId } = ctx.query;
    const queryArr = [kdtId, taskId];
    const result = await new TaskService(ctx).getTaskContent(queryArr);
    ctx.json(0, 'ok', result);
  }

  async getTaskContentByDate(ctx) {
    const { alias, taskDate } = ctx.query;
    const { kdtId } = ctx;
    const queryArr = [kdtId, alias, taskDate];
    const result = await new TaskService(ctx).getTaskContentByDate(queryArr);
    ctx.json(0, 'ok', result);
  }
}

module.exports = TaskController;
