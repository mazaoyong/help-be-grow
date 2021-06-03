module.exports = [
  ['GET', '/v4/vis/edu/page/teachers', 'edu-admin.teacher.TeachersController', 'getIndexHtml'],
  ['GET', '/v4/vis/edu/teachers/queryTeacherListWithStatistic.json', 'edu-admin.teacher.TeachersController', 'queryTeacherListWithStatistic'],
  ['POST', '/v4/vis/edu/teachers/exportTeacherListWithStatistic.json', 'edu-admin.teacher.TeachersController', 'exportTeacherListWithStatistic'],
  ['GET', '/v4/vis/edu/teachers/queryCourseList.json', 'edu-admin.teacher.TeachersController', 'queryCourseList'],
  ['POST', '/v4/vis/edu/teachers/exportCourseList.json', 'edu-admin.teacher.TeachersController', 'exportCourseList'],
  ['GET', '/v4/vis/edu/teachers/queryLessonList.json', 'edu-admin.teacher.TeachersController', 'queryLessonList'],
  ['POST', '/v4/vis/edu/teachers/exportLessonList.json', 'edu-admin.teacher.TeachersController', 'exportLessonList'],
  ['GET', '/v4/vis/edu/teachers/getById.json', 'edu-admin.teacher.TeachersController', 'getById'],
  ['GET', '/v4/vis/edu/teachers/queryTeacherLessonStatistics.json', 'edu-admin.teacher.TeachersController', 'queryTeacherLessonStatistics'],
];
