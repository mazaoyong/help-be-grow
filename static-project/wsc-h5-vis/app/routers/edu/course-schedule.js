/**
 * 我的课程表相关接口
 */
module.exports = [
  [
    // 我的课程表
    'GET',
    '/wscvis/edu/course-schedule',
    'edu.RenderController',
    'getCourseScheduleHtml',
  ],

  // 获取日历数据
  [
    'GET',
    '/wscvis/edu/course-schedule/calendarData.json',
    'edu.CourseScheduleController',
    'getCalendarData',
  ],

  // 查询学员某天的课程
  [
    'GET',
    '/wscvis/edu/course-schedule/lessonsByDate.json',
    'edu.CourseScheduleController',
    'getLessonsByDate',
  ],

  // 获取当前用户下关联的学员列表
  [
    'GET',
    '/wscvis/edu/student/findByCustomerId.json',
    'edu.StudentController',
    'findByCustomerIdJson',
  ],
];
