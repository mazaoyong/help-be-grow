const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.exercisebook.ExerciseBookStatisticsFacade */
class ExerciseBookStatisticsFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.ExerciseBookStatisticsFacade';
  }

  /**
   * 作业本管理-学员列表
   *  查询作业本下面的学员信息
   * @link http://zanapi.qima-inc.com/site/service/view/1008743
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.exerciseBookId - 作业本id
   * @param {Object} query.joinTime - 加入时间
   * @param {string} query.studentName - 学员姓名
   * @return {Promise}
   */

  async findStudentPageByCondition(kdtId, pageRequest, query) {
    return this.invoke('findStudentPageByCondition', [kdtId, pageRequest, query]);
  }

  /**
   * 获取作业本的预览数据
   * @link http://zanapi.qima-inc.com/site/service/view/1003696
   * @param {number} kdtId -
   * @param {number} exerciseBookId -
   * @return {Promise}
   */

  async getExerciseBookOverview(kdtId, exerciseBookId) {
    return this.invoke('getExerciseBookOverview', [kdtId, exerciseBookId]);
  }

  /**
   * 作业本管理-学员列表
   *  学员导出
   * @link http://zanapi.qima-inc.com/site/service/view/1023929
   * @param {number} kdtId -
   * @param {Object} query -
   * @param {Object} query.joinTime - 加入时间
   * @param {string} query.studentName - 学员姓名
   * @param {number} query.bookId - 作业本id
   * @return {Promise}
   */

  async exportStudent(kdtId, query) {
    return this.invoke('exportStudent', [kdtId, query]);
  }
}

module.exports = ExerciseBookStatisticsFacade;
