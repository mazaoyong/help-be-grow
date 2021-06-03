module.exports = [
  /**
   * 导入
   */
  [
    // 创建批量导入题目任务
    'POST',
    '/v4/vis/supv/question-bank/createImportTask.json',
    'supv.questionBank.QuestionBankImportController',
    'createImportTask',
  ],
  [
    // 导入列表页
    'GET',
    '/v4/vis/supv/question-bank/findImportTaskByPage.json',
    'supv.questionBank.QuestionBankImportController',
    'findImportTaskByPage',
  ],
  /**
   * 题目API
   */
  [
    'GET',
    '/v4/vis/supv/question-bank',
    'supv.questionBank.QuestionBankListController',
    'getIndexHtml',
  ],
  [
    // 查询题目列表
    'GET',
    '/v4/vis/supv/question-bank/findPageByCondition.json',
    'supv.questionBank.QuestionBankListController',
    'findPageByCondition',
  ],
  [
    // 删除题目
    'POST',
    '/v4/vis/supv/question-bank/deleteQuestion.json',
    'supv.questionBank.QuestionBankListController',
    'deleteQuestion',
  ],
  [
    // 移动题目
    'POST',
    '/v4/vis/supv/question-bank/moveQuestion.json',
    'supv.questionBank.QuestionBankListController',
    'moveQuestion',
  ],
  [
    // 获取题目详情
    'GET',
    '/v4/vis/supv/question-bank/getQuestionDetail.json',
    'supv.questionBank.QuestionBankEditController',
    'getQuestionDetail',
  ],
  [
    // 新建题目
    'POST',
    '/v4/vis/supv/question-bank/_textarea_/createQuestion.json',
    'supv.questionBank.QuestionBankEditController',
    'createQuestion',
  ],
  [
    // 更新题目
    'POST',
    '/v4/vis/supv/question-bank/_textarea_/updateQuestion.json',
    'supv.questionBank.QuestionBankEditController',
    'updateQuestion',
  ],
  /**
   * 分类API
   */
  [
    // 查询题目分类
    'GET',
    '/v4/vis/supv/question-bank/getCategoryList.json',
    'supv.questionBank.QuestionBankClassifyController',
    'findCategoryByCondition',
  ],
  [
    // 新建题目分类
    'POST',
    '/v4/vis/supv/question-bank/createCategory.json',
    'supv.questionBank.QuestionBankClassifyController',
    'createCategory',
  ],
  [
    // 更新题目分类
    'POST',
    '/v4/vis/supv/question-bank/updateCategory.json',
    'supv.questionBank.QuestionBankClassifyController',
    'updateCategory',
  ],
  [
    // 删除题目分类
    'POST',
    '/v4/vis/supv/question-bank/deleteCategory.json',
    'supv.questionBank.QuestionBankClassifyController',
    'deleteCategory',
  ],
  [
    // 移动题目分类
    'POST',
    '/v4/vis/supv/question-bank/moveCategory.json',
    'supv.questionBank.QuestionBankClassifyController',
    'moveCategory',
  ],
];
