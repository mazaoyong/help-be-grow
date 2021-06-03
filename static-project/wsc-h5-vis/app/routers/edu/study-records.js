module.exports = [
  ['GET', '/wscvis/edu/study-records', 'edu.RenderController', 'getStudyRecordsHtml'],

  // 查询学员列表
  [
    'GET',
    '/wscvis/edu/student/studentList.json',
    'edu.StudyRecordsController',
    'getStudentList',
  ],

  // 查询某个学员所有上课记录
  [
    'GET',
    '/wscvis/edu/student/studyRecords.json',
    'edu.StudyRecordsController',
    'getStudyRecords',
  ],
];
