const mapKeysToSnakeCase = require('zan-utils/string/mapKeysToSnakeCase');
const KnowledgeBaseService = require('../KnowledgeBaseService');

class ActivityService extends KnowledgeBaseService {
  /**
   * 内容页通用活动获取接口
   */
  async listActivities(params) {
    let ret = await this.owlApiCall({
      url: '/owl/list/activities',
      data: params,
    });
    return mapKeysToSnakeCase(ret);
  }
}

module.exports = ActivityService;
