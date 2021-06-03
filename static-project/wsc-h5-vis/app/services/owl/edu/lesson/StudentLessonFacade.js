const BaseService = require('../../../base/BaseService');

class StudentLessonFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.edu.api.lesson.StudentLessonFacade';
  }

  /**
   *  查询一段时间内是否有上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351022
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.studentId - 学员id（userId和studentId 至少传一个,优先studentId）
   *  @param {number} query.kdtId -
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {number} query.userId - 客户id（userId和studentId 至少传一个,优先studentId）
   *  @return {Promise}
   */
  async findStudentValidRecordList(kdtId, query) {
    return this.invoke('findStudentValidRecordList', [kdtId, query]);
  }

  /**
   *  查询某天的上课记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/351023
   *
   *  @param {number} kdtId -
   *  @param {Object} query -
   *  @param {number} query.studentId - 学员id（userId和studentId 至少传一个,优先studentId）
   *  @param {number} query.kdtId -
   *  @param {string} query.startTime - 开始时间
   *  @param {string} query.endTime - 结束时间
   *  @param {number} query.userId - 客户id（userId和studentId 至少传一个,优先studentId）
   *  @return {Promise}
   */
  async findStudentLessonByDate(kdtId, query) {
    return this.invoke('findStudentLessonByDate', [kdtId, query]);
  }
}

module.exports = StudentLessonFacade;
