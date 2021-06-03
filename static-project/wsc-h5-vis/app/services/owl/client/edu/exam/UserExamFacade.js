const BaseService = require('../../../../base/BaseService');

/* com.youzan.owl.api.client.edu.exam.UserExamFacade -  */
class UserExamFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.api.client.edu.exam.UserExamFacade';
  }

  /**
   *  用户参与考试
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896410
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 参数
   *  @param {number} command.examId - 考试的id
   *  @param {number} command.userRole - 用户角色
   *  @param {number} command.userId - 参加考试的userId
   *  @return {Promise}
   */
  async start(kdtId, command) {
    return this.invoke('start', [kdtId, command]);
  }

  /**
   *  获取考试结果
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902774
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} userExamQuery - 查询信息
   *  @param {number} userExamQuery.userExamId -
   *  @param {number} userExamQuery.examId -
   *  @param {number} userExamQuery.userId -
   *  @return {Promise}
   */
  async getResult(kdtId, userExamQuery) {
    return this.invoke('getResult', [kdtId, userExamQuery]);
  }

  /**
   *  获取用户答卷的概括
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/898252
   *
   *  @param {number} kdtId - 店铺id
   *  @param {string} query - 查询信息
   *  @return {Promise}
   */
  async getSimpleAnswerPaper(kdtId, query) {
    return this.invoke('getSimpleAnswerPaper', [kdtId, query]);
  }

  /**
   *  获取页面控制参数
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/904681
   *
   *  @param {number} kdtId - 店铺id
   *  @param {number} userId - 用户id
   *  @return {Promise}
   */
  async getPage(kdtId, userId) {
    return this.invoke('getPage', [kdtId, userId]);
  }

  /**
   *  获取考试答题卡
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902775
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} userExamQuery - 查询信息
   *  @param {number} userExamQuery.userExamId -
   *  @param {number} userExamQuery.examId -
   *  @param {number} userExamQuery.userId -
   *  @return {Promise}
   */
  async getAnswerCard(kdtId, userExamQuery) {
    return this.invoke('getAnswerCard', [kdtId, userExamQuery]);
  }

  /**
   *  查询考试详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896409
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} examDetailQuery -
   *  @param {number} examDetailQuery.examId - 考试模板id
   *  @param {number} examDetailQuery.userId - 用户id
   *  @return {Promise}
   */
  async getDetail(kdtId, examDetailQuery) {
    return this.invoke('getDetail', [kdtId, examDetailQuery]);
  }

  /**
   *  获取上一个问题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896411
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.examId - 考试实例id
   *  @param {number} query.currentQuestionId - 当前的问题id
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getPrevQuestion(kdtId, query) {
    return this.invoke('getPrevQuestion', [kdtId, query]);
  }

  /**
   *  获取下一个问题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896412
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.examId - 考试实例id
   *  @param {number} query.currentQuestionId - 当前的问题id
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getNextQuestion(kdtId, query) {
    return this.invoke('getNextQuestion', [kdtId, query]);
  }

  /**
   *  跳转到当前问题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896413
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.examId - 考试实例id
   *  @param {number} query.currentQuestionId - 当前的问题id
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getQuestion(kdtId, query) {
    return this.invoke('getQuestion', [kdtId, query]);
  }

  /**
   *  用户回答问题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896414
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 回答的问题内容
   *  @param {Array.<Array>} command.answerTexts[] - 回答内容
   *  @param {Array} command.answerTexts[] -
   *  @param {number} command.examId - 考试id
   *  @param {number} command.currentQuestionId - 问题编号
   *  @param {number} command.userId - 用户id
   *  @param {Array.<Array>} command.chooseOptionIds[] - 选择的选项id
   *  @param {Array} command.chooseOptionIds[] -
   *  @return {Promise}
   */
  async answerQuestion(kdtId, command) {
    return this.invoke('answerQuestion', [kdtId, command]);
  }

  /**
   *  获取最近回答的问题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896415
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} query - 查询参数
   *  @param {number} query.examId - 考试实例id
   *  @param {number} query.userId - 用户id
   *  @return {Promise}
   */
  async getLatestQuestion(kdtId, query) {
    return this.invoke('getLatestQuestion', [kdtId, query]);
  }

  /**
   *  完成考试，提交答卷
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/896416
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} command - 提交的信息
   *  @param {boolean} command.autoSubmit - 是否自动提交
   *  @param {number} command.userExamId - 考试id
   *  @param {number} command.userId - 用户id
   *  @return {Promise}
   */
  async submit(kdtId, command) {
    return this.invoke('submit', [kdtId, command]);
  }

  /**
   *  查询用户的考试列表信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/902490
   *
   *  @param {number} kdtId - 店铺id
   *  @param {Object} pageRequest - 分页参数
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {string} query - 查询信息
   *  @return {Promise}
   */
  async findByUser(kdtId, pageRequest, query) {
    return this.invoke('findByUser', [kdtId, pageRequest, query]);
  }
}

module.exports = UserExamFacade;
