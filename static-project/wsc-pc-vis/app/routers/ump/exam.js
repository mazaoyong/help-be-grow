module.exports = [
  [
    // 页面
    'GET',
    '/v4/vis/pct/page/exam',
    'ump.ExamController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 查询小测试列表
    'GET',
    '/v4/vis/pct/exam/getList.json',
    'ump.ExamController',
    'getListExamByQueryJson',
  ],
  [
    // 查询基础信息
    'GET',
    '/v4/vis/pct/exam/getBasisList.json',
    'ump.ExamController',
    'getBasisJson',
  ],
  [
    // 更新保存基础信息
    'POST',
    '/v4/vis/pct/exam/postSaveBasis.json',
    'ump.ExamController',
    'postSaveBasisJson',
  ],
  [
    // 查询问题列表
    'GET',
    '/v4/vis/pct/exam/getTitleLists.json',
    'ump.ExamController',
    'getTitleListsJson',
  ],
  [
    // 保存问题列表
    'POST',
    '/v4/vis/pct/exam/postSaveTitle.json',
    'ump.ExamController',
    'postSaveTitleJson',
  ],
  [
    // 更新问题列表
    'POST',
    '/v4/vis/pct/exam/postUpdateQuestionList.json',
    'ump.ExamController',
    'postUpdateQuestionListJson',
  ],
  [
    // 获取结果信息
    'GET',
    '/v4/vis/pct/exam/getResultList.json',
    'ump.ExamController',
    'getResultListJson',
  ],
  [
    // 保存结果
    'POST',
    '/v4/vis/pct/exam/postSaveResult.json',
    'ump.ExamController',
    'postSaveResultJson',
  ],
  [
    // 更新结果
    'POST',
    '/v4/vis/pct/exam/postUpdateResultList.json',
    'ump.ExamController',
    'postUpdateResultListJson',
  ],
  [
    // 获取完成页信息
    'GET',
    '/v4/vis/pct/exam/getFinish.json',
    'ump.ExamController',
    'getFinishJson',
  ],
  [
    // 保存完成页信息
    'POST',
    '/v4/vis/pct/exam/postSaveFinish.json',
    'ump.ExamController',
    'postSaveFinishJson',
  ],
  [
    // 失效活动
    'POST',
    '/v4/vis/pct/exam/failureActivity.json',
    'ump.ExamController',
    'postFailureActivityJson',
  ],
  [
    // 删除活动
    'POST',
    '/v4/vis/pct/exam/deleteActivity.json',
    'ump.ExamController',
    'postDeleteActivityJson',
  ],
  [
    // 获取公众号推广码
    'GET',
    '/v4/vis/pct/exam/getExamMpQrCode.json',
    'ump.ExamController',
    'getExamMpQrCodeJson',
  ],
  // 复制活动
  [
    'POST',
    '/v4/vis/pct/exam/copy.json',
    'ump.ExamController',
    'copy',
  ],
  // 分页查询客户信息
  [
    'GET',
    '/v4/vis/ump/exam/getCustomerList.json',
    'ump.ExamController',
    'getCustomerList',
  ],
  // 分页查询测验参与用户列表
  [
    'GET',
    '/v4/vis/ump/exam/findPage.json',
    'ump.ExamController',
    'findPage',
  ],
  // 查询用户测验的成绩单
  [
    'GET',
    '/v4/vis/ump/exam/getTranscript.json',
    'ump.ExamController',
    'getTranscript',
  ],
  // 查询用户测验的答题详情
  [
    'GET',
    '/v4/vis/ump/exam/getUserAnswerDetail.json',
    'ump.ExamController',
    'getUserAnswerDetail',
  ],
  // 查询测验是否有用户参与
  [
    'GET',
    '/v4/vis/ump/exam/examExistUser.json',
    'ump.ExamController',
    'examExistUser',
  ],
];
