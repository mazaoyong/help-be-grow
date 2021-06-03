const BaseService = require('../base/BaseService');

/** com.youzan.owl.ump.api.exam.ExamQuestionFacade -  */
class ExamQuestionFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.ump.api.exam.ExamQuestionFacade';
  }

  /**
   *  直接查询小测试下所有的问题列表
   *
   *  @param {Object} query - 查询参数
   *  @return {Object}
   */
  async getQuestionList(query) {
    return this.invoke('getQuestionList', [query]);
  }

  /**
   *  保存问题列表, 支持新建问题和更新问题
   *
   *  @param {Object} questionSaveList - 问题列表
   *  @return {Object}
   */
  async saveQuestionList(questionSaveList) {
    return this.invoke('saveQuestionList', [questionSaveList]);
  }

  /**
   *  更新问题列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/436130
   *
   *  @param {Object} questionSaveList -
   *  @param {Array.<Array>} questionSaveList.deleteQuestionIdList[] - 删除的问题id列表
   *  @param {Array} questionSaveList.deleteQuestionIdList[] -
   *  @param {number} questionSaveList.kdtId - 店铺id
   *  @param {Array.<Array>} questionSaveList.deleteItemIdList[] - 删除的问题选项id列表
   *  @param {Array} questionSaveList.deleteItemIdList[] -
   *  @param {number} questionSaveList.examId - 测试id
   *  @param {Array.<Object>} questionSaveList.questionList[] - 问题列表
   *  @return {Promise}
   */
  async updateQuestionList(questionSaveList) {
    return this.invoke('updateQuestionList', [questionSaveList]);
  }
}

module.exports = ExamQuestionFacade;
