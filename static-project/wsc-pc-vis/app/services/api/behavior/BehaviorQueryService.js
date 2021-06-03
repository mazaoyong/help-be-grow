const BaseService = require('../../base/BaseService');

/**
 * 客户行为
 */
class BehaviorQueryService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.behavior.service.BehaviorQueryService';
  }

  /**
   * 获取yzUid交易数据
   * http://zanapi.qima-inc.com/site/service/view/44868
   *
   * @param {*} params
   */
  async getSummaryByYzUid(params) {
    const data = await this.invoke('getSummaryByYzUid', [params]);
    return data;
  }

  /**
   * 获取fans交易数据
   * http://zanapi.qima-inc.com/site/service/view/44870
   *
   * @param {*} params
   */
  async getSummaryByFans(params) {
    const data = await this.invoke('getSummaryByFans', [params]);
    return data;
  }
}

module.exports = BehaviorQueryService;
