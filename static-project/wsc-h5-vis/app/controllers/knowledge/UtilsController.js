const KnowledgeBaseController = require('./KnowledgeBaseController');
const MpService = require('../../services/owl/api/MpService');

class UtilsController extends KnowledgeBaseController {
  /**
   * 天网打点前端方法
   */
  async postSkynetJson(ctx) {
    const { log, extra = {} } = ctx.request.body;
    ctx.visLogger.info(
      `[FELogData]-${JSON.stringify(log || ctx.request.body)}`,
      '',
      extra
    );
    ctx.json(0, 'ok', {});
  }

  /**
   * 天网打点前端方法 error
   */
  async postSkynetErrorJson(ctx) {
    const { log, extra = {} } = ctx.request.body;
    ctx.visLogger.error(
      `[FELogData]-${JSON.stringify(log || ctx.request.body)}`,
      '',
      extra
    );
    ctx.json(0, 'ok', {});
  }

  /**
   * 获取公众号关注状态
   */
  async getWxFollowStatusJson(ctx) {
    const { kdtId, buyerId } = ctx;
    const { columnAlias } = ctx.query;
    const ret = await new MpService(ctx).ifNeedNoticeFollow(kdtId, buyerId, columnAlias);
    ctx.json(0, 'ok', ret);
  }
}

module.exports = UtilsController;
