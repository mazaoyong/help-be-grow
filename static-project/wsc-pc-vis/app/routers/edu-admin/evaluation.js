module.exports = [
  [
    'GET',
    '/v4/vis/edu/page/evaluation',
    'edu-admin.CourseEvaluationController',
    'getIndexHtml',
  ],

  // 获取评价列表
  [
    'GET',
    '/v4/vis/edu/evaluation/getEvaluationList.json',
    'edu-admin.CourseEvaluationController',
    'getEvaluationListJson',
  ],

  // 提交商家评论
  [
    'PUT',
    '/v4/vis/edu/evaluation/putSellerEvaluation.json',
    'edu-admin.CourseEvaluationController',
    'putSellerEvaluation',
  ],
];
