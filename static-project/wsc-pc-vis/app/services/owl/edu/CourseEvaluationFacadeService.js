const BaseService = require('../../base/BaseService');

/** */
class CourseEvaluationFacadeService extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.courseevaluation.CourseEvaluationFacade';
  }

  /**
   * 获取评价列表
   *
   * @param {*} kdtId
   * @param {*} query
   * @param {*} pageRequest
   * @see http://zanapi.qima-inc.com/site/service/view/344682
   * @memberof CourseEvaluationFacadeService
   */
  async getEvaluationList(kdtId, query, pageRequest) {
    return this.invoke('findByCondition', [kdtId, query, pageRequest]);
  }

  /**
   * 提交卖家评价
   *
   * @param {*} kdtId
   * @param {*} command
   * @see http://zanapi.qima-inc.com/site/service/view/344683
   * @memberof CourseEvaluationFacadeService
   */
  async putEvaluation(kdtId, command) {
    return this.invoke('createEvaluationReply', [kdtId, command]);
  }
}

module.exports = CourseEvaluationFacadeService;
