const KnowledgeBaseService = require('../KnowledgeBaseService');

class GoodsRecommendService extends KnowledgeBaseService {
  get GoodsRecommendService() {
    return 'com.youzan.owl.ump.api.recommendation.RecommendFacade';
  }

  /**
   * 获取推荐内容
   */
  async findRecommend(req) {
    const result = await this.invoke(this.GoodsRecommendService, 'findRecommend', [req]);
    return result;
  }
}

module.exports = GoodsRecommendService;
