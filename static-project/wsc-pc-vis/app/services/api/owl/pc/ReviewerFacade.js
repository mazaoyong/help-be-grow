const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.pc.api.exercisebook.ReviewerFacade */
class ReviewerFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.exercisebook.ReviewerFacade';
  }

  /**
   * 评阅
   * @link http://zanapi.qima-inc.com/site/service/view/1023958
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {string} command.score - 成绩
   * @param {number} command.reviewerId - 批阅人
   * @param {number} command.excellentScore - 是否是优秀作业
   *  0：否
   *  1：是
   * @param {Array} command.comment - 评语
   * @param {number} command.type - 类型
   *  1：提交
   *  2：草稿
   * @param {number} command.assignmentId - 学生作业id
   * @return {Promise}
   */

  async review(kdtId, command) {
    return this.invoke('review', [kdtId, command]);
  }

  /**
   * 批阅作业本的时候
   *    查看的上一个
   *    查看的下一个
   *    批阅的下一个
   * @link http://zanapi.qima-inc.com/site/service/view/1023959
   * @param {number} kdtId -
   * @param {Object} query -
   * @param {number} query.exerciseBookId - 作业本id
   * @param {number} query.reviewerId - 批阅人
   *  如果查询全部批阅人，为空
   *  指定批阅人，批阅人的员工id
   * @param {number} query.channel - 来源
   *  1：学员的维度，查看的是学员的所有作业
   *  2：作业的维度，查看的是作业下面的所有学员作业
   * @param {Object} query.submitTimeRange - 提交时间
   * @param {string} query.orderBy - 排序的字段
   * @param {string} query.title - 作业标题
   * @param {number} query.assignmentId - 当前所在的学员作业id
   * @param {number} query.userId - 学员id
   * @param {number} query.homeworkId - 作业id
   * @param {number} query.excellentScore - 成绩的排名
   *  0：全部
   *  1：优秀作业
   *  2：非优秀作业
   * @param {Object} query.publishTimeRange - 发布时间
   * @param {string} query.studentName - 学员姓名
   * @param {number} query.status - 学员作业的状态
   *  0：查询所有
   *  1：未批阅
   *  2：已批阅
   * @return {Promise}
   */

  async assignmentSort(kdtId, query) {
    return this.invoke('assignmentSort', [kdtId, query]);
  }

  /**
   * 查询老师的最新评语
   *  针对的是老师维度
   *
   * @link http://zanapi.qima-inc.com/site/service/view/1023960
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.userId - 批阅人id
   * @param {number} query.status - 批阅的状态
   * @return {Promise}
   */
  async findLatestComment(kdtId, pageRequest, query) {
    return this.invoke('findLatestComment', [kdtId, pageRequest, query]);
  }

  /**
   * 学员作业详情
   *
   * @link http://zanapi.qima-inc.com/site/service/view/1003718
   * @param {number} kdtId -
   * @param {number} assignmentId -
   * @return {Promise}
   */
  async getAssignment(kdtId, assignmentId) {
    return this.invoke('getAssignment', [kdtId, assignmentId]);
  }

  /**
   * 查询作业详情
   *  场景：
   *    商家端小程序，批阅人查询作业详情
   * @link http://zanapi.qima-inc.com/site/service/view/1024356
   * @param {number} kdtId -
   * @param {number} homeworkId -
   * @return {Promise}
   */
  async getHomeworkDetail(kdtId, homeworkId) {
    return this.invoke('getHomeworkDetail', [kdtId, homeworkId]);
  }
}

module.exports = ReviewerFacade;
