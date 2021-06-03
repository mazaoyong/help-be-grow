const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.exercisebook.AssignmentFacade */
class AssignmentFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.AssignmentFacade';
  }

  /**
   * 场景：
   *    查询的是作业本下某个具体作业的所有学员提交的列表
   *    维度：作业
   *  前端路径
   *    作业本管理 --> 作业列表 --> 学员作业
   * @link http://zanapi.qima-inc.com/site/service/view/1008746
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.reviewUserId - 批阅人
   *  如果查询全部批阅人，批阅人：0
   *  指定批阅人，批阅人的员工id
   * @param {number} query.homeworkId - 作业id
   * @param {number} query.exerciseBookId - 作业本id
   * @param {string} query.studentName - 学员姓名
   * @param {number} query.status - 学员作业的状态
   *  0：查询所有
   *  1：未批阅
   *  2：已批阅
   * @return {Promise}
   */

  async findHomeworkAssignmentPage(kdtId, pageRequest, query) {
    return this.invoke('findHomeworkAssignmentPage', [kdtId, pageRequest, query]);
  }

  /**
   * 场景：
   *    作业本管理 --> 学员作业
   *    查询的是某个具体的作业本下面，具体学员的所有作业列表
   *    维度：学员
   *  前端路径
   *    作业本管理 --> 学员列表 --> 查看作业
   * @link http://zanapi.qima-inc.com/site/service/view/1023970
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.exerciseBookId - 作业本id
   * @param {number} query.reviewerId - 批阅人
   *  如果查询全部批阅人，为空
   *  指定批阅人，批阅人的员工id
   * @param {Object} query.publishTimeRange - 发布时间
   * @param {number} query.excellentScore - 成绩的排名
   *  0：全部
   *  1：优秀作业
   *  2：非优秀作业
   * @param {Object} query.submitTimeRange - 提交时间
   * @param {string} query.title - 作业标题
   * @param {number} query.userId - 学员id
   * @param {number} query.status - 学员作业的状态,针对的是商家端的
   *  0：查询所有
   *  1：未批阅
   *  2：已批阅
   * @return {Promise}
   */
  async findExerciseAssignmentPage(kdtId, pageRequest, query) {
    return this.invoke('findExerciseAssignmentPage', [kdtId, pageRequest, query]);
  }
}

module.exports = AssignmentFacade;
