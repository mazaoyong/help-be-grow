const KnowledgeBaseController = require('../KnowledgeBaseController');
const RefferalService = require('../../../services/knowledge/blocks/RefferalService');
const AssetsAdapterService = require('../../../services/owl/ump/assets/AssetsAdapterFacade');

class RefferalController extends KnowledgeBaseController {
  /**
   * 获取推荐有礼活动信息
   */
  async getRefferalInfoJson(ctx) {
    const params = ctx.query;

    let result = await new RefferalService(ctx).getRefferalActivity(params);

    ctx.json(0, 'ok', result);
  }

  /**
   * 开通商户号
   */
  async getAccountBusinessNumberJson(ctx) {
    let buyerId = this.ctx.buyerId;
    let result = await new AssetsAdapterService(ctx).getAccountBusinessNumber({ buyerId });
    ctx.json(0, 'ok', result);
  }
}

module.exports = RefferalController;
