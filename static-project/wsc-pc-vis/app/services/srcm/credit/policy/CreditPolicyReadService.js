const BaseService = require('../../../base/BaseService');

/**
 * 获取自定义积分名称
 * @see http://zanapi.qima-inc.com/site/service/view/279989
 */
class CreditPolicyReadService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.scrm.api.credit.policy.CreditPolicyReadService';
  }
  /**
   * 获取自定义积分名称
   * http://zanapi.qima-inc.com/site/service/view/279989
   *
   * @param {Object} req
   * @return {Promise<any>}
   */
  async getName(req) {
    const result = await this.invoke('getName', [req]);

    return result;
  }

  /**
   *  查询积分商城规则
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/373567
   *
   *  @param {Object} queryDTO -
   *  @param {number} queryDTO.kdtId - 店铺ID
   *  @param {string} queryDTO.requestId -
   *  @param {string} queryDTO.appName -
   *  @param {number} queryDTO.version - 版本号
   可选, 默认当前版本
   *  @return {Promise}
   */
  async getPointStoreRule(queryDTO) {
    return this.invoke('getPointStoreRule', [queryDTO]);
  }
}

module.exports = CreditPolicyReadService;
