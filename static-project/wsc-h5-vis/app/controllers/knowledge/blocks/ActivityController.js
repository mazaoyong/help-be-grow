const KnowledgeBaseController = require('../KnowledgeBaseController');
const ActivityServiceFromIron = require('../../../services/knowledge/blocks/ActivityService');
const ActivityService = require('../../../services/owl/ump/core/ActivityService');

class ActivityController extends KnowledgeBaseController {
  /**
   * 内容页通用活动获取接口
   */
  async getActivityInfosJson(ctx) {
    const { kdt_id: kdtId, alias } = ctx.query;
    let { fans_type: fansType = 0 } = ctx.getLocalSession();
    const adminId = ctx.userId;
    const ret = await new ActivityServiceFromIron(ctx).listActivities({
      kdtId, alias, adminId, fansType,
    });
    ctx.json(0, 'ok', ret);
  }

  async getNewActivityInfosJson(ctx) {
    const kdtId = ctx.kdtId;
    const query = {
      userId: this.ctx.userId,
      productType: ctx.query.productType,
      productAlias: ctx.query.alias,
      platform: ctx.query.platform,
    };

    const result = await new ActivityService(ctx).findByProduct({
      kdtId, query,
    });
    ctx.json(0, 'ok', result);
  }
}

module.exports = ActivityController;
