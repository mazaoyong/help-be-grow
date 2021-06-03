module.exports = [
  ['GET', '/v4/vis/h5/edu/book-listen', 'h5.clue.BookListenController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/getStudents.json', 'h5.clue.BookListenController', 'getStudentsJson'],
  ['GET', '/v4/vis/h5/edu/getCourseList.json', 'h5.clue.BookListenController', 'getCourseListJson'],
  ['GET', '/v4/vis/h5/edu/getDays.json', 'h5.clue.BookListenController', 'getDaysJson'],
  [
    'GET',
    '/v4/vis/h5/edu/bookListen/getLessons.json',
    'h5.clue.BookListenController',
    'getLessonsJson',
  ],
  [
    'POST',
    '/v4/vis/h5/edu/createAppointment.json',
    'h5.clue.BookListenController',
    'createAppointmentJson',
  ],
  [
    'POST',
    '/v4/vis/h5/edu/createClueAppointment.json',
    'h5.clue.BookListenController',
    'createClueAppointmentJson',
  ],
  [
    'POST',
    '/v4/vis/h5/edu/confirmAppointment.json',
    'h5.clue.BookListenController',
    'confirmAppointmentJson',
  ],
  [
    'GET',
    '/v4/vis/h5/edu/getAppointment.json',
    'h5.clue.BookListenController',
    'getAppointmentJson',
  ],
  [
    // 修改预约时的详情获取
    'GET',
    '/v4/vis/h5/edu-admin/appointment/getStudentLessonForUpdate.json',
    'h5.clue.BookListenController',
    'getStudentLessonForUpdate',
  ],
  [
    // 更新预约
    'POST',
    '/v4/vis/h5/edu-admin/appointment/updateStudentLesson.json',
    'h5.clue.BookListenController',
    'updateStudentLesson',
  ],
];
