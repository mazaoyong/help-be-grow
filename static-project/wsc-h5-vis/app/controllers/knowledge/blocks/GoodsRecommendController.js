const KnowledgeBaseController = require('../KnowledgeBaseController');
const GoodsRecommendService = require('../../../services/knowledge/blocks/GoodsRecommendService');

class GoodsRecommendController extends KnowledgeBaseController {
  /**
   * 获取推荐商品列表
   */
  async findRecommend(ctx) {
    const req = ctx.request.query || {};
    req.kdtId = ctx.kdtId;
    const result = await new GoodsRecommendService(ctx).findRecommend(req);
    ctx.json(0, 'ok', result);
  }
}

module.exports = GoodsRecommendController;
