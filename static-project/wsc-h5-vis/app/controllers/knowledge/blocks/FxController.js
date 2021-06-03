const KnowledgeBaseController = require('../KnowledgeBaseController');
const SalesmanService = require('../../../services/owl/ump/salesman/SalesmanService');

class FxController extends KnowledgeBaseController {
  /**
   * 静默分销员，检查用户身份,并静默注册成为分销员
   */
  async postDistributor(ctx) {
    const kdtId = ctx.kdtId;
    const userId = ctx.buyerId;
    const ret = await new SalesmanService(ctx).register(
      [kdtId, userId]
    );
    ctx.json(0, 'ok', ret);
  }
}

module.exports = FxController;
