// 作业
module.exports = [
  [
    // 创建作业
    'POST',
    '/v4/vis/supv/homework/work/createHomework.json',
    'supv.homework.HomeworkController',
    'createHomework',
  ],
  [
    // 编辑作业
    'PUT',
    '/v4/vis/supv/homework/work/updateHomework.json',
    'supv.homework.HomeworkController',
    'updateHomework',
  ],
  [
    // 获取作业详情
    'GET',
    '/v4/vis/supv/homework/work/getHomeworkDetail.json',
    'supv.homework.HomeworkController',
    'getHomeworkDetail',
  ],
  [
    // 进入页面
    'GET',
    [
      '/v4/vis/supv/homework/work',
      '/v4/vis/supv/homework/work/*',
    ],
    'supv.homework.HomeworkController',
    ['initLifecycle', 'getIndexHtml'],
  ],
  [
    // 删除作业
    'DELETE',
    '/v4/vis/supv/homework/work/deleteHomework.json',
    'supv.homework.HomeworkController',
    'deleteHomework',
  ],
];
