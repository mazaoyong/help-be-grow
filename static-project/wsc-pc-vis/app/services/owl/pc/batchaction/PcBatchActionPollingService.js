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
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/380606
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} taskNo - 任务编号
   *  @return {Promise}
   */
  async getActionResult(kdtId, taskNo) {
    return this.invoke('getActionResult', [kdtId, taskNo]);
  }

  /**
   *  查询批量任务执行状态,支持连锁
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/439109
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 任务编号
   *  @param {number} query.kdtId - 校区店铺id
   *  @param {string} query.taskNo - 任务编号
   *  @return {Promise}
   */
  async getActionResultV2(kdtId, query) {
    return this.invoke('getActionResultV2', [kdtId, query]);
  }
}

module.exports = BatchActionPollingService;
