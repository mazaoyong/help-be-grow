module.exports = [
  [
    // 课节列表
    'GET',
    ['/v4/vis/edu/appointment/lessons.json'],
    'edu-admin.appointment.LessonController',
    'getLessonsJson',
  ],
  [
    // 课节列表
    'GET',
    ['/v4/vis/edu-admin/appointment/lessonsByPage.json'],
    'edu-admin.appointment.LessonController',
    'getLessonByPage',
  ],
  [
    // 可用的时间列表
    'get',
    ['/v4/vis/edu/appointment/days.json'],
    'edu-admin.appointment.LessonController',
    'getDaysJson',
  ],
  [
    // 可用的地点列表
    'get',
    ['/v4/vis/edu/appointment/address.json'],
    'edu-admin.appointment.LessonController',
    'getAddressJson',
  ],
  [
    'GET',
    ['/v4/vis/edu/appointment/conflict.json'],
    'edu-admin.appointment.LessonController',
    'detectDateRange',
  ],
];
