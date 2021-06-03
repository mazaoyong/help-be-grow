module.exports = [
  [
    // 线下课列表
    'GET',
    ['/v4/vis/edu/appointment/courses.json'],
    'edu-admin.appointment.ScheduleController',
    'getCoursesJson',
  ],
];
