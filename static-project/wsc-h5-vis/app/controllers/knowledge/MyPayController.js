const KnowledgeBaseController = require('./KnowledgeBaseController');
const ExistenceCheckFacade = require('../../services/owl/api/common/ExistenceCheckFacade');

/**
 * 我购买的课程页面controller
 */
class MyPayController extends KnowledgeBaseController {
  // 检查四个tab下商品购买状态，是否购买
  async checkExist(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const result = await new ExistenceCheckFacade(ctx).checkExist(kdtId, userId);
    ctx.json(0, 'ok', result);
  }
}

module.exports = MyPayController;
