const BaseService = require('../../../base/BaseService');

/* com.youzan.owl.pc.api.questions.QuestionFacade -  */
class QuestionFacade extends BaseService {
  get SERVICE_NAME() {
    return 'com.youzan.owl.pc.api.questions.QuestionFacade';
  }

  /**
   *  按照条件查询相关的试题列表
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895490
   *
   *  @param {number} kdtId -
   *  @param {Object} questionQuery -
   *  @param {number} questionQuery.level - 试题难度：(1,简单), (2,普通), (3,较难)
   *  @param {string} questionQuery.title - 试题标题（富文本字段）
   *  @param {number} questionQuery.type - 试题类型：(1,单选题),(2,多选题),(3,判断题),(4,填空题),(5,简答题)
   *  @param {number} questionQuery.categoryId - 试题直属分类id
   *  @param {Object} pageRequest -
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @return {Promise}
   */
  async findPageByCondition(kdtId, questionQuery, pageRequest) {
    return this.invoke('findPageByCondition', [kdtId, questionQuery, pageRequest]);
  }

  /**
   *  创建试题导入任务
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895492
   *
   *  @param {number} kdtId -
   *  @param {Object} command -
   *  @param {number} command.importType - 导入类型
        com.youzan.owl.oc.api.importtask.enums.ImportTypeEnum
        7: "导入教育题库试题"
   *  @param {Object} command.importFile - 导入文件信息，包含url
   *  @param {number} command.targetKdtId - 所属店铺id
   *  @param {number} command.categoryId - 分类id
   *  @param {Object} command.operator - 本次导入任务的创建者
   *  @return {Promise}
   */
  async createImportTask(kdtId, command) {
    return this.invoke('createImportTask', [kdtId, command]);
  }

  /**
   *  查询导入记录
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895493
   *
   *  @param {number} kdtId - 店铺Id
   *  @param {Object} pageRequest - 分页信息
   *  @param {number} pageRequest.pageNumber -
   *  @param {boolean} pageRequest.countEnabled - 是否开启count，默认为开启
   *  @param {number} pageRequest.pageSize -
   *  @param {Object} pageRequest.sort -
   *  @param {[object Object]} pageRequest.sort.orders -
   *  @param {Object} query - 查询
   *  @return {Promise}
   */
  async findImportTaskByPage(kdtId, pageRequest, query) {
    return this.invoke('findImportTaskByPage', [kdtId, pageRequest, query]);
  }

  /**
   *  批量删除试题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895488
   *
   *  @param {number} kdtId -
   *  @param {Object} deleteCommand -
   *  @param {Array.<Array>} deleteCommand.ids[] - 试题id
   *  @param {Object} deleteCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async deleteQuestion(kdtId, deleteCommand) {
    return this.invoke('deleteQuestion', [kdtId, deleteCommand]);
  }

  /**
   *  转移试题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895489
   *
   *  @param {number} kdtId -
   *  @param {Object} moveCommand -
   *  @param {Array.<Array>} moveCommand.ids[] - 试题ids
   *  @param {number} moveCommand.targetCategoryId - 目标分类id
   *  @param {Object} moveCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async moveQuestion(kdtId, moveCommand) {
    return this.invoke('moveQuestion', [kdtId, moveCommand]);
  }

  /**
   *  获取试题详情
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895491
   *
   *  @param {number} kdtId -
   *  @param {number} id -
   *  @return {Promise}
   */
  async getQuestionDetail(kdtId, id) {
    return this.invoke('getQuestionDetail', [kdtId, id]);
  }

  /**
   *  创建试题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895486
   *
   *  @param {number} kdtId -
   *  @param {Object} createCommand -
   *  @param {number} createCommand.score - 试题分数，精确到小数点后两位，实际页面展示时，需要除以100
   *  @param {Object} createCommand.choiceQuestion - 选择题（单选/多选）
   *  @param {number} createCommand.level - 试题难度：(1,简单), (2,普通), (3,较难)
   *  @param {Object} createCommand.fillQuestion - 填空题
   *  @param {Object} createCommand.essayQuestion - 问答题
   *  @param {string} createCommand.answerAnalysis - 答案解析（富文本字段）
   *  @param {number} createCommand.id - 试题id
   *  @param {string} createCommand.title - 试题标题（富文本字段）
   *  @param {number} createCommand.type - 试题类型：(1,单选题),(2,多选题),(3,判断题),(4,填空题),(5,简答题)
   *  @param {Object} createCommand.judgeQuestion - 判断题
   *  @param {number} createCommand.categoryId - 题目关联的直属分类id
   *  @param {Object} createCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async createQuestion(kdtId, createCommand) {
    return this.invoke('createQuestion', [kdtId, createCommand]);
  }

  /**
   *  更新试题
   *  zanAPI文档地址: http://zanapi.qima-inc.com/site/service/view/895487
   *
   *  @param {number} kdtId -
   *  @param {Object} updateCommand -
   *  @param {number} updateCommand.score - 试题分数，精确到小数点后两位，实际页面展示时，需要除以100
   *  @param {Object} updateCommand.choiceQuestion - 选择题（单选/多选）
   *  @param {number} updateCommand.level - 试题难度：(1,简单), (2,普通), (3,较难)
   *  @param {Object} updateCommand.fillQuestion - 填空题
   *  @param {Object} updateCommand.essayQuestion - 问答题
   *  @param {string} updateCommand.answerAnalysis - 答案解析（富文本字段）
   *  @param {number} updateCommand.id - 试题id
   *  @param {string} updateCommand.title - 试题标题（富文本字段）
   *  @param {number} updateCommand.type - 试题类型：(1,单选题),(2,多选题),(3,判断题),(4,填空题),(5,简答题)
   *  @param {Object} updateCommand.judgeQuestion - 判断题
   *  @param {number} updateCommand.categoryId - 题目关联的直属分类id
   *  @param {Object} updateCommand.operator - 操作人信息
   *  @return {Promise}
   */
  async updateQuestion(kdtId, updateCommand) {
    return this.invoke('updateQuestion', [kdtId, updateCommand]);
  }
}

module.exports = QuestionFacade;
