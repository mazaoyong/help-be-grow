const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.ump.ExamParticipationPCFacade -  */
class ExamParticipationPCFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.ump.ExamParticipationPCFacade';
  }

  /**
   *  分页查询测验参与用户列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/718912
   *
   *  @param {number} kdtId - 当前店铺kdtId
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.kdtId - 店铺id
   *  @param {Array.<Array>} query.userIdList[] - 筛选的用户id
   *  @param {number} query.examId - 测验id
   *  @return {Promise}
   */
  async findPage(kdtId, pageRequest, query) {
    return this.invoke('findPage', [kdtId, pageRequest, query]);
  }

  /**
   *  查询用户测验的成绩单
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/718913
   *
   *  @param {number} kdtId - 当前店铺
   *  @param {Object} query - 查询参数
   *  @param {number} query.examRecordId - 测验记录的id
   *  @param {number} query.kdtId - 目标店铺kdtId
   *  @return {Promise}
   */
  async getTranscript(kdtId, query) {
    return this.invoke('getTranscript', [kdtId, query]);
  }

  /**
   *  查询用户测验的答题详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/718914
   *
   *  @param {number} kdtId - 当前店铺
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {Object} query - 查询条件
   *  @param {number} query.examRecordId - 测验记录的id
   *  @param {number} query.kdtId - 目标店铺kdtId
   *  @param {Array.<Array>} query.includeExamQuestionIds[] - 查询特定的答题。为空时，查询全部
   *  @return {Promise}
   */
  async getUserAnswerDetail(kdtId, pageRequest, query) {
    return this.invoke('getUserAnswerDetail', [kdtId, pageRequest, query]);
  }
}

module.exports = ExamParticipationPCFacade;
