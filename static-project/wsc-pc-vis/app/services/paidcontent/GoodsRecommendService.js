const BaseService = require('../base/BaseService');

class GoodsRecommendService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.recommendation.RecommendFacade';
  }

  // 获取推荐设置
  async findRecommend(req) {
    const result = await this.invoke('findRecommend', [req]);
    return result;
  }

  async createMediaEndingRecommend(req) {
    const result = await this.invoke('createMediaEndingRecommend', [req]);
    return result;
  }

  async changeMediaEndingRecommend(req) {
    const result = await this.invoke('changeMediaEndingRecommend', [req]);
    return result;
  }

  async deleteMediaEndingRecommend(req) {
    const result = await this.invoke('deleteMediaEndingRecommend', [req]);
    return result;
  }

  async createPageDetailRecommend(req) {
    const result = await this.invoke('createPageDetailRecommend', [req]);
    return result;
  }

  async changePageDetailRecommend(req) {
    const result = await this.invoke('changePageDetailRecommend', [req]);
    return result;
  }

  async deletePageDetailRecommend(req) {
    const result = await this.invoke('deletePageDetailRecommend', [req]);
    return result;
  }
}

module.exports = GoodsRecommendService;
