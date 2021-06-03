const BaseService = require('../../../base/BaseService');

class ReviewerFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.ReviewerFacade';
  }

  /**
   *  学员作业详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/1003718
   *
   *  @param {number} kdtId -
   *  @param {number} assignmentId -
   *  @return {Promise}
   */
  async getAssignment(kdtId, assignmentId) {
    return this.invoke('getAssignment', [kdtId, assignmentId]);
  }
}

module.exports = ReviewerFacade;
