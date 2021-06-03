const BaseService = require('../../../base/BaseService');

/** com.youzan.owl.api.client.edu.exercise.ReviewerExerciseFacade */
class ReviewerExerciseFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.exercise.ReviewerExerciseFacade';
  }

  /**
   * 布置作业
   * @link http://zanapi.qima-inc.com/site/service/view/1003884
   * @param {number} kdtId -
   * @param {number} userId -
   * @param {Object} command -
   * @param {number} command.scoreStyle - 评分机制
   *  1：分数制
   *  2：等第制
   * @param {string} command.publishTime - 定时上架时间
   * @param {number} command.exerciseBookId - 作业本id
   * @param {number} command.timerPublish - 定时发布的开关
   *  1：开启
   *  0：关闭
   * @param {number} command.scoreRule - 计分规则
   *  1：十分制
   *  2：百分制
   * @param {Array} command.detail - 详情
   * @param {string} command.title - 作业标题
   * @param {string} command.deadline - 截止日期
   * @return {Promise}
   */
  async createHomework(kdtId, userId, command) {
    return this.invoke('createHomework', [kdtId, userId, command]);
  }

  /**
   * 编辑作业
   * @link http://zanapi.qima-inc.com/site/service/view/1008753
   * @param {number} kdtId -
   * @param {number} userId -
   * @param {Object} command -
   * @param {number} command.scoreStyle - 评分机制
   *  1：分数制
   *  2：等第制
   * @param {string} command.publishTime - 定时上架时间
   * @param {number} command.exerciseBookId - 作业本id
   * @param {number} command.timerPublish - 定时发布的开关
   *  1：开启
   *  0：关闭
   * @param {number} command.scoreRule - 计分规则
   *  1：十分制
   *  2：百分制
   * @param {Array} command.detail - 详情
   * @param {string} command.title - 作业标题
   * @param {string} command.deadline - 截止日期
   * @return {Promise}
   */
  async updateHomework(kdtId, userId, command) {
    return this.invoke('updateHomework', [kdtId, userId, command]);
  }

  /**
   * 查询作业详情
   * @link http://zanapi.qima-inc.com/site/service/view/1003885
   * @param {number} kdtId -
   * @param {number} userId -
   * @param {string} alias -
   * @return {Promise}
   */
  async getHomeworkDetail(kdtId, userId, alias) {
    return this.invoke('getHomeworkDetail', [kdtId, userId, alias]);
  }

  /**
   * 查询学员作业详情 - 老师
   * @link http://zanapi.qima-inc.com/site/service/view/1008756
   * @param {number} kdtId -
   * @param {Object} query -
   * @param {number} query.userId - 批阅人的用户id
   * @param {number} query.assignmentId - 学员作业id
   * @return {Promise}
   */
  async getReviewerAssignment(kdtId, query) {
    return this.invoke('getReviewerAssignment', [kdtId, query]);
  }

  /**
   * 批阅作业
   * @link http://zanapi.qima-inc.com/site/service/view/1003886
   * @param {number} kdtId -
   * @param {Object} command -
   * @param {string} command.score - 成绩
   * @param {number} command.reviewerId - 批阅人
   * @param {number} command.excellentScore - 是否是优秀作业
   *  0：否
   *  1：是
   * @param {Array} command.comment - 评语
   * @param {number} command.type - 类型
   *  1：草稿
   *  2：批阅
   * @param {number} command.assignmentId - 学生作业id
   * @return {Promise}
   */
  async review(kdtId, command) {
    return this.invoke('review', [kdtId, command]);
  }

  /**
   * 查询老师的最新评语
   *  针对的是老师维度
   * @link http://zanapi.qima-inc.com/site/service/view/1003887
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {number} query.userId - 批阅人的用户id
   * @return {Promise}
   */
  async findLatestComment(kdtId, pageRequest, query) {
    return this.invoke('findLatestComment', [kdtId, pageRequest, query]);
  }

  /**
   * 分页查询学生作业
   * @link http://zanapi.qima-inc.com/site/service/view/1008755
   * @param {number} kdtId -
   * @param {Object} pageRequest - 分页请求
   * @param {number} pageRequest.pageNumber -
   * @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   * @param {number} pageRequest.pageSize -
   * @param {Object} pageRequest.sort -
   * @param {Object} query -
   * @param {string} query.alias - 作业alias
   * @param {number} query.userId - 批阅人的用户id
   * @param {number} query.status - 学生作业的状态
   *  1：待批阅
   *  2：已批阅
   * @return {Promise}
   */
  async findAssignmentPage(kdtId, pageRequest, query) {
    return this.invoke('findAssignmentPage', [kdtId, pageRequest, query]);
  }
}

module.exports = ReviewerExerciseFacade;
