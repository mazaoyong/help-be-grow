const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.importtask.ImportFacade -  */
class AnswerPaperFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.examination.AnswerPaperFacade';
  }

  /**
      * 批阅列表
      *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897915
      *
      *  @param {number} kdtId - 店铺ID
      *  @param {Object} pageRequest - 分页参数
      *  @param {number} pageRequest.pageNumber -
      *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
      *  @param {number} pageRequest.pageSize -
      *  @param {Object} pageRequest.sort -
      *  @param {Object} query - 查询条件
      *  @param {number} query.examTemplateId - 考试模板ID
      *  @param {string} query.examUserName - 参与人姓名
      *  @param {number} query.reviewerId - 批阅人ID
      *  @param {Object} query.submitDateRange - 提交时间范围
      *  @param {number} query.status - 批阅状态 0 or null -> 批阅和未批阅，1 -> 未批阅, 2 -> 已批阅
      *  @return {Promise}
    */
  async findByReview(kdtId, pageRequest, query) {
    return this.invoke('findByReview', [kdtId, pageRequest, query]);
  }

  /**
    批阅详情
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897916
    *
    *  @param {number} kdtId - 店铺ID
    *  @param {Object} query - 查询条件
    *  @param {number} query.answerPaperId - 答卷ID
    *  @return {Promise}
  */
  async getReviewDetail(kdtId, query) {
    return this.invoke('getReviewDetail', [kdtId, query]);
  }

  /**
   *  批阅
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/897917
   *
   *  @param {number} kdtId - 店铺ID
   *  @param {Object} command - 批阅命令
   *  @param {number} command.reviewerId - 批阅人ID
   *  @param {Array.<Object>} command.reviews[] - 批阅内容
   *  @param {number} command.reviews[].score - 评分
   *  @param {number} command.reviews[].questionId - 题目ID
   *  @param {string} command.reviews[].comment - 评语
   *  @param {number} command.answerPaperId - 答卷ID
   *  @return {Promise}
   */
  async review(kdtId, command) {
    return this.invoke('review', [kdtId, command]);
  }

  /**
    *  答卷
    *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/907699
    *
    *  @param {number} kdtId - 店铺ID
    *  @param {Object} query - 查询条件
    *  @param {number} query.answerPaperId - 答卷ID
    *  @param {Object} query.option - 查询可选项
    *  @param {boolean} query.option.queryNext - 是否查询当前答卷的下一个答卷
    *  @param {Object} query.option - 查询可选项
    *  @param {boolean} query.option.queryNext - 是否查询当前答卷的下一个答卷 注意：选项互斥
    *  @param {boolean} query.option.queryPrevious - 是否查询当前答卷的前一个答卷  注意：选项互斥
    *  @param {boolean} query.option.queryNextNotReview - 是否查询当前答卷的下一个未批阅的答卷 注意：选项互斥
    *  @return {Promise}
  */
  async getReviewIdByOption(kdtId, query) {
    return this.invoke('get', [kdtId, query]);
  }
}

module.exports = AnswerPaperFacade;
