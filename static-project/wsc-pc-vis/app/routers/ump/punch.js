module.exports = [
  [
    // 页面
    'GET',
    '/v4/vis/pct/page/punch',
    'ump.PunchController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 打卡列表
    'GET',
    '/v4/vis/pct/punch/list.json',
    'ump.PunchController',
    'getListJson',
  ],
  [
    // 创建打卡活动
    'POST',
    '/v4/vis/pct/punch/active.json',
    'ump.PunchController',
    'postActiveJson',
  ],
  [
    // 删除打卡活动
    'DELETE',
    '/v4/vis/pct/punch/active.json',
    'ump.PunchController',
    'deleteActiveJson',
  ],
  [
    // 获取打卡详情
    'GET',
    '/v4/vis/pct/punch/active.json',
    'ump.PunchController',
    'getActiveJson',
  ],
  [
    // 更新打卡活动
    'PUT',
    '/v4/vis/pct/punch/active.json',
    'ump.PunchController',
    'putActiveJson',
  ],
  [
    // 删除打卡活动
    'DELETE',
    '/v4/vis/pct/punch/active.json',
    'ump.PunchController',
    'deleteActiveJson',
  ],
  [
    // 上下架群打卡
    'PUT',
    '/v4/vis/pct/punch/status.json',
    'ump.PunchController',
    'putStatusJson',
  ],
  [
    // 获取群打卡简要信息
    'GET',
    '/v4/vis/pct/punch/brief.json',
    'ump.PunchController',
    'getBriefJson',
  ],
  [
    // 获取群打卡统计信息
    'GET',
    '/v4/vis/pct/punch/statistics.json',
    'ump.PunchController',
    'getStatisticsJson',
  ],
  [
    // 打卡任务列表
    'GET',
    '/v4/vis/pct/punch/task/list.json',
    'ump.PunchController',
    'getTaskListJson',
  ],
  [
    // 打卡任务详情
    'GET',
    '/v4/vis/pct/punch/task.json',
    'ump.PunchController',
    'getTaskJson',
  ],
  [
    // 打卡任务修改
    'PUT',
    '/v4/vis/pct/punch/task.json',
    'ump.PunchController',
    'putTaskJson',
  ],
  [
    // 群打卡推广配置
    'GET',
    '/v4/vis/pct/punch/promotion.json',
    'ump.PunchController',
    'getPromotionJson',
  ],
  [
    // 更新打卡推广配置
    'PUT',
    '/v4/vis/pct/punch/promotion.json',
    'ump.PunchController',
    'putPromotionJson',
  ],
  [
    // 查询评论列表
    'GET',
    '/v4/vis/pct/punch/log.json',
    'ump.PunchController',
    'getLogsJson',
  ],
  [
    // 老师评论
    'POST',
    '/v4/vis/pct/punch/log.json',
    'ump.PunchController',
    'postLogsJson',
  ],
  [
    // 老师评论列表
    'GET',
    '/v4/vis/pct/punch/teacherLog.json',
    'ump.PunchController',
    'getTeacherLogsJson',
  ],
  [
    // 删除评论
    'DELETE',
    '/v4/vis/pct/punch/log.json',
    'ump.PunchController',
    'deleteLogsJson',
  ],
  [
    // 打卡日记精选状态
    'PUT',
    '/v4/vis/pct/punch/diary/selection.json',
    'ump.PunchController',
    'putSelectionStatus',
  ],
  [
    // 打卡日记显示/隐藏
    'PUT',
    '/v4/vis/pct/punch/diary/show.json',
    'ump.PunchController',
    'putShowStatus',
  ],
  [
    // 查询学员数据
    'GET',
    '/v4/vis/pct/punch/student.json',
    'ump.PunchController',
    'getStudentJson',
  ],
  [
    // 查询学员数据
    'GET',
    '/v4/vis/pct/punch/daily.json',
    'ump.PunchController',
    'getDailyJson',
  ],
  [
    // 查询专栏列表
    'GET',
    '/v4/vis/pct/punch/columns.json',
    'ump.PunchController',
    'getColumnListJson',
  ],
  [
    // 导出数据
    'GET',
    '/v4/vis/pct/punch/export',
    'ump.PunchController',
    'export',
  ],
  [
    // 微页面查询打卡列表
    'GET',
    '/v4/vis/pct/punch/wym.json',
    'ump.PunchController',
    'getWymListJson',
  ],
];
