// 作业本
module.exports = [
  [
    // 作业本 - 进入页面
    'GET',
    [
      '/v4/vis/supv/homework/workbook',
      '/v4/vis/supv/homework/workbook/*'
    ],
    'supv.homework.WorkbookController',
    ['initLifecycle', 'getIndexHtml'],
  ],
  [
    // 作业本 - 分页查询作业本列表
    'GET',
    '/v4/vis/supv/homework/book/findPageByCondition.json',
    'supv.homework.WorkbookController',
    'findPageByCondition',
  ],
  [
    // 作业本 - 作业本上下架
    'POST',
    '/v4/vis/supv/homework/book/updateExerciseBookSoldStatus.json',
    'supv.homework.WorkbookController',
    'updateExerciseBookSoldStatus',
  ],
  [
    // 作业本 - 作业本删除
    'DELETE',
    '/v4/vis/supv/homework/book/deleteWorkbook.json',
    'supv.homework.WorkbookController',
    'deleteExerciseBook',
  ],
  [
    // 作业本 - 创建作业本
    'POST',
    '/v4/vis/supv/homework/book/createExerciseBook.json',
    'supv.homework.WorkbookController',
    'createExerciseBook',
  ],
  [
    // 作业本 - 更新作业本内容
    'PUT',
    '/v4/vis/supv/homework/book/updateExerciseBook.json',
    'supv.homework.WorkbookController',
    'updateExerciseBook',
  ],
  [
    // 作业本 - 获取作业本详情
    'GET',
    '/v4/vis/supv/homework/book/getExerciseBookDetail.json',
    'supv.homework.WorkbookController',
    'getExerciseBookDetail',
  ],
  [
    // 作业本 - 获取作业本概览数据
    'GET',
    '/v4/vis/supv/homework/book/getExerciseBookOverview.json',
    'supv.homework.WorkbookController',
    'getExerciseBookOverview',
  ],
  [
    // 作业本 - 获取班级列表
    'GET',
    '/v4/vis/supv/homework/book/findClassPageByCondition.json',
    'supv.homework.WorkbookController',
    'findClassPageByCondition',
  ],
  [
    // 作业本 - 获取班级关联的作业本列表
    'GET',
    '/v4/vis/supv/homework/book/findExerciseRelClassPage.json',
    'supv.homework.WorkbookController',
    'findExerciseRelClassPage',
  ],
];
