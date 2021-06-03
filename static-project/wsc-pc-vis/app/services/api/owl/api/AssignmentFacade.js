const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.edu.exercise.AssignmentFacade */
class AssignmentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.exercise.AssignmentFacade';
  }

  /**
   * 作业交流区，查询作业
   * @link http://zanapi.qima-inc.com/site/service/view/1003903
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {string} query.alias - 作业alias
   * @param {number} query.userId - 用户id
   * @return {Promise}
   */
  async findExcellentAssignmentPage(kdtId, pageRequest, query) {
    return this.invoke('findExcellentAssignmentPage', [kdtId, pageRequest, query]);
  }
}

module.exports = AssignmentFacade;
