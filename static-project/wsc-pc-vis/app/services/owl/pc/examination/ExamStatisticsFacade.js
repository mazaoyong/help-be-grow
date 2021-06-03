const BaseService = require('../../../base/BaseService');
/* com.youzan.owl.pc.api.examination.ExamStatisticsFacade -  */
class ExamStatisticsFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.examination.ExamStatisticsFacade';
  }

  /**
   *  根据考试模板id获取考试基本统计信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909570
   *
   *  @param {number} kdtId -
   *  @param {number} examTemplateId -
   *  @return {Promise}
   */
  async getBaseStatById(kdtId, examTemplateId) {
    return this.invoke('getBaseStatById', [kdtId, examTemplateId]);
  }

  /**
   *  根据考试模板id获取考试分数段信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909571
   *
   *  @param {number} kdtId -
   *  @param {number} examTemplateId -
   *  @return {Promise}
   */
  async findListStageStatById(kdtId, examTemplateId) {
    return this.invoke('findListStageStatById', [kdtId, examTemplateId]);
  }

  /**
             *  根据考试模板id获取每道题的正确率
  <p>
  对于随机组卷这种业务场景，这个地方就不好做了，主要的原因是很难获取到题目列表
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909572
  *
             *  @param {number} kdtId -
             *  @param {number} examTemplateId -
             *  @param {Object} pageRequest -
             *  @param {number} pageRequest.pageNumber -
             *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
             *  @param {number} pageRequest.pageSize -
             *  @param {Object} pageRequest.sort -
             *  @param {[object Object]} pageRequest.sort.orders -
             *  @return {Promise}
             */
  async findPageQuestionStatById(kdtId, examTemplateId, pageRequest) {
    return this.invoke('findPageQuestionStatById', [kdtId, examTemplateId, pageRequest]);
  }

  /**
   *  根据考题获取选项或者每一个空的正确率
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909573
   *
   *  @param {number} kdtId -
   *  @param {Object} questionOptionQuery -
   *  @param {number} questionOptionQuery.examTemplateId - 考试模板id
   *  @param {number} questionOptionQuery.questionId - 考试问题id
   *  @return {Promise}
   */
  async getOptionStatById(kdtId, questionOptionQuery) {
    return this.invoke('getOptionStatById', [kdtId, questionOptionQuery]);
  }

  /**
             *  查询考试用户学员信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909574
  *
             *  @param {number} kdtId -
             *  @param {Object} examUserQuery -
             *  @param {number} examUserQuery.examTemplateId - 考试模板id
             *  @param {number} examUserQuery.submitedStatus - 提交状态
  -1:全部
  1:未提交
  2:已提交
             *  @param {string} examUserQuery.startTime - 考试开始时间
             *  @param {string} examUserQuery.endTime - 考试结束时间
             *  @param {number} examUserQuery.userId - 用户id 或学员id
             *  @param {Object} examUserQuery.operator - 操作人
             *  @param {Object} pageRequest -
             *  @param {number} pageRequest.pageNumber -
             *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
             *  @param {number} pageRequest.pageSize -
             *  @param {Object} pageRequest.sort -
             *  @return {Promise}
             */
  async findPageUserStat(kdtId, examUserQuery, pageRequest) {
    return this.invoke('findPageUserStat', [kdtId, examUserQuery, pageRequest]);
  }

  /**
   *  用户信息采集查找
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909575
   *
   *  @param {number} kdtId -
   *  @param {number} userExamId -
   *  @return {Promise}
   */
  async getExamUserCollectionInfo(kdtId, userExamId) {
    return this.invoke('getExamUserCollectionInfo', [kdtId, userExamId]);
  }

  /**
             *  导出考试用户学员信息
  *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/909577
  *
             *  @param {number} kdtId -
             *  @param {Object} examUserQuery -
             *  @param {number} examUserQuery.examTemplateId - 考试模板id
             *  @param {number} examUserQuery.submitedStatus - 提交状态
  -1:全部
  1:未提交
  2:已提交
             *  @param {string} examUserQuery.startTime - 考试开始时间
             *  @param {string} examUserQuery.endTime - 考试结束时间
             *  @param {number} examUserQuery.userId - 用户id 或学员id
             *  @param {Object} examUserQuery.operator - 操作人
             *  @return {Promise}
             */
  async exportUserStat(kdtId, examUserQuery) {
    return this.invoke('exportUserStat', [kdtId, examUserQuery]);
  }
}

module.exports = ExamStatisticsFacade;
