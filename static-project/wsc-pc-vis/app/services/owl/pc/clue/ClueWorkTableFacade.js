const BaseService = require('../../../base/BaseService');

class ClueWorkTableFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.clue.ClueWorkTableFacade';
  }

  /**
   *  个人工作台数据概览
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400444
   *
   *  @param {number} kdtId -
   *  @param {number} userId -
   *  @return {Promise}
   */
  async getClueDataOverview(kdtId, userId) {
    return this.invoke('getClueDataOverview', [kdtId, userId]);
  }

  /**
   *  个人工作台今日待办概览
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/400445
   *
   *  @param {number} kdtId -
   *  @param {number} userId -
   *  @return {Promise}
   */
  async getClueTodoOverview(kdtId, userId) {
    return this.invoke('getClueTodoOverview', [kdtId, userId]);
  }
}

module.exports = ClueWorkTableFacade;
