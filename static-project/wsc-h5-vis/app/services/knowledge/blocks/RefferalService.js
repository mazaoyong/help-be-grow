const KnowledgeBaseService = require('../KnowledgeBaseService');

class RefferalService extends KnowledgeBaseService {
  get REFFERAL_ACTIVITY_SERVICE() {
    return 'com.youzan.owl.biz.service.RecommendedPoliteService';
  }

  get ASSETS_ADAPTER_SERVICE() {
    return 'com.youzan.owl.biz.service.adapter.AssetsAdapterService';
  }

  /**
  * 获取推荐有礼活动信息
  * @param {*} query
  */
  async getRefferalActivity(query) {
    const result = await this.invoke(this.REFFERAL_ACTIVITY_SERVICE, '', [query]);
    return result;
  }

  /**
   * 开通商户号
   * @param {*} query
   * @param query.buyerId
   */
  async getAccountBusinessNumber(query) {
    const result = await this.invoke(this.ASSETS_ADAPTER_SERVICE, 'getAccountBusinessNumber', [query]);
    return result;
  }
}

module.exports = RefferalService;
