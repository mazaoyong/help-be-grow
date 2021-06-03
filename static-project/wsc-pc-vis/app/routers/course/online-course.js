module.exports = [
  // 课程学习记录 —— 学习明细
  ['GET', '/v4/vis/course/online-course/findDetail.json', 'course.online-course.OnlineCourseController', 'findDetail'],
  // 个人学习记录 —— 学习明细
  ['GET', '/v4/vis/course/online-course/findUserLearnDetail.json', 'course.online-course.OnlineCourseController', 'findUserLearnDetail'],
  // 个人学习记录 —— 数据统计
  ['GET', '/v4/vis/course/online-course/getUserOverview.json', 'course.online-course.OnlineCourseController', 'getUserOverview'],
  // 学习记录 —— 数据统计
  ['GET', '/v4/vis/course/online-course/getOverview.json', 'course.online-course.OnlineCourseController', 'getOverview'],
  // 学习记录 —— 数据趋势
  ['GET', '/v4/vis/course/online-course/getTrend.json', 'course.online-course.OnlineCourseController', 'getTrend'],
  // 学习记录 —— 数据导出
  ['GET', '/v4/vis/course/online-course/exportTask.json', 'course.online-course.OnlineCourseController', 'exportTask'],
];
