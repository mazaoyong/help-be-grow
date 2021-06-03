const BaseService = require('../../../base/BaseService');

/**
 * com.youzan.owl.pc.api.signin.SignInFacade
 * */
class BatchActionPollingService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.batchaction.BatchActionPollingFacade';
  }

  /**
   *  查询批量任务执行状态
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/379163
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} taskNo - 任务编号
   *  @return {Promise}
   */
  async getActionResult(kdtId, taskNo) {
    return this.invoke('getActionResult', [kdtId, taskNo]);
  }

  /**
   *  获取批量签到结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/726354
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 任务编号
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {string} query.taskNo - 任务编号
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async getBatchSignInResult(kdtId, query) {
    return this.invoke('getBatchSignInResult', [kdtId, query]);
  }

  /**
   *  获取单个签到结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/726353
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 任务编号
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {string} query.taskNo - 任务编号
   *  @param {Object} query.operator - 操作人
   *  @return {Promise}
   */
  async getSignInResult(kdtId, query) {
    return this.invoke('getSignInResult', [kdtId, query]);
  }
}

module.exports = BatchActionPollingService;
