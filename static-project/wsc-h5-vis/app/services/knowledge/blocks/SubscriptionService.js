const KnowledgeBaseService = require('../KnowledgeBaseService');

class SubscriptionService extends KnowledgeBaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.v2.subscription.SubscriptionFacade';
  }
  // 获取已购专栏列表
  async findSubsColumnList(dto) {
    const result = await this.invoke(this.SERVICE_NAME, 'findSubsColumnList', dto);
    return result;
  }

  // 获取已购内容和直播
  async findSubsContentAndLiveList(dto) {
    const result = await this.invoke(this.SERVICE_NAME, 'findSubsContentAndLiveList', dto);
    return result;
  }
};

module.exports = SubscriptionService;
