const ExamBaseService = require('./ExamBaseService');

class ExamService extends ExamBaseService {
  get WITHDRAW_SERVICE() {
    return 'com.youzan.owl.ump.api.exam.ExamCustomerFacade';
  }

  /**
   *  提交用户测试的答案
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178127
   *
   *  @param {number} answerDTO.recordId - 测试id
   *  @param {number} answerDTO.fansId - 用户的fansId
   *  @param {number} answerDTO.kdtId - 店铺id
   *  @param {Array.<Array>} answerDTO.questionIdList[] - 问题id列表
   *  @param {number} answerDTO.examId - 测试id
   *  @param {Array.<Array>} answerDTO.itemIdList[] - 问题选项列表
   *  @param {number} answerDTO.userId - 用户id
   *  @param {number} answerDTO.fansType - fansId对应的类型
   *  @return {object}
   */
  async submitAnswer(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'submitAnswer', [params]);
    return result;
  }

  /**
   *  获取问题列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178130
   *
   *  @param {object} questionQueryDTO - nonnull:kdtId
   *  @param {number} questionQueryDTO.kdtId - 店铺的id
   *  @param {number} questionQueryDTO.examId - 测试的id
   *  @param {number} questionQueryDTO.id - 问题的id
   *  @return {object}
   */
  async getQuestionList(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getQuestionList', [params]);
    return result;
  }

  /**
   *  提交用户参与测试的信息
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178126
   *
   *  @param {object} join - 用户参与测试的信息
   *  @param {number} join.fansId - 用户的fansId
   *  @param {number} join.kdtId - 店铺id
   *  @param {number} join.examId - 测试id
   *  @param {number} join.userId - 用户id
   *  @param {number} join.fansType - fansId对应的类型
   *  @return {object}
   */
  async joinExam(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'joinExam', [params]);
    return result;
  }

  /**
   *  获取测试的详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/181419
   *
   *  @param {object} query - nonnull:id, userId, kdtId
   *  @param {number} query.kdtId - 店铺id
   *  @param {number} query.id - 测试的id
   *  @param {number} query.userId - 用户id
   *  @param {number} query.status - 查询状态
   *  @return {object}
   */
  async getExamDetail(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getExamDetail', [params]);
    return result;
  }

  /**
   *  获取测试记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178132
   *
   *  @param {object} queryDTO - nonnull:userId, kdtId, examId
   *  @param {number} queryDTO.fansId - 用户的fansId
   *  @param {number} queryDTO.kdtId - 店铺id
   *  @param {number} queryDTO.examId - 测试id
   *  @param {number} queryDTO.userId - 用户id
   *  @param {number} queryDTO.fansType - fansId对应的类型
   *  @return {object}
   */
  async getExamRecord(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getExamRecord', [params]);
    return result;
  }

  /**
   *  获取分享的样式和链接
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/178129
   *
   *  @param {object} shareExamQueryDTO - 查询分享的参数
   *  @param {number} shareExamQueryDTO.kdtId - 店铺id
   *  @param {number} shareExamQueryDTO.examId - 测试id
   *  @return {object}
   */
  async getShare(params) {
    const result = await this.owlInvoke(this.WITHDRAW_SERVICE, 'getShare', [params]);
    return result;
  }
}

module.exports = ExamService;
