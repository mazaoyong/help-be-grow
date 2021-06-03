// 作业本管理
module.exports = [
  [
    // 作业本管理 - 获取作业本中的作业列表
    'GET',
    '/v4/vis/supv/homework/workbook-manage/findPageByCondition.json',
    'supv.homework.WorkbookManageController',
    'findPageByCondition',
  ],
  [
    // 作业本管理 - 查询作业本下面的学员信息列表
    'GET',
    '/v4/vis/supv/homework/workbook-manage/findStudentPageByCondition.json',
    'supv.homework.WorkbookManageController',
    'findStudentPageByCondition',
  ],
  [
    // 作业本管理 - 学员列表信息导出
    'POST',
    '/v4/vis/supv/homework/workbook-manage/exportStudent.json',
    'supv.homework.WorkbookManageController',
    'exportStudent',
  ],
  [
    // 作业本管理 - 进入页面
    'GET',
    [
      '/v4/vis/supv/homework/workbook-manage',
      '/v4/vis/supv/homework/workbook-manage/*',
    ],
    'supv.homework.WorkbookManageController',
    ['initLifecycle', 'getIndexHtml'],
  ],
];
