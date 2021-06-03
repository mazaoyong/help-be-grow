// 学生作业
module.exports = [
  [
    // 作业本 - 学生作业列表
    'GET',
    '/v4/vis/supv/homework/work/findExerciseAssignmentPage.json',
    'supv.homework.AssignmentController',
    'findExerciseAssignmentPage',
  ],
  [
    // 作业 - 学生作业列表
    'GET',
    '/v4/vis/supv/homework/assignment/findHomeworkAssignmentPage.json',
    'supv.homework.AssignmentController',
    'findHomeworkAssignmentPage',
  ],
  [
    // 批阅 - 获取作业详情（含答题详情、批阅）
    'GET',
    '/v4/vis/supv/homework/assignment/getAssignment.json',
    'supv.homework.AssignmentController',
    'getAssignment',
  ],
  [
    // 批阅作业
    'POST',
    '/v4/vis/supv/homework/assignment/review.json',
    'supv.homework.AssignmentController',
    'review',
  ],
  [
    // 批阅作业 - 获取当前作业的上一个下一个信息
    'POST',
    '/v4/vis/supv/homework/assignment/assignmentSort.json',
    'supv.homework.AssignmentController',
    'assignmentSort',
  ],
  [
    // 作业 - 进入页面
    'GET',
    [
      '/v4/vis/supv/homework/assignment',
      '/v4/vis/supv/homework/assignment/*',
    ],
    'supv.homework.AssignmentController',
    ['initLifecycle', 'getIndexHtml'],
  ],
];
