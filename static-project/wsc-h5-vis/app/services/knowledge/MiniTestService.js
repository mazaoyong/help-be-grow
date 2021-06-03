// const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const KnowledgeBaseService = require('./KnowledgeBaseService');

class MiniTestService extends KnowledgeBaseService {
  /**
   * 获取测试详情
   */
  async examDetail(userInfo) {
    return this.owlApiCall({
      url: '/live/user/enable/update',
      data: userInfo,
    });
  }
}

module.exports = MiniTestService;
