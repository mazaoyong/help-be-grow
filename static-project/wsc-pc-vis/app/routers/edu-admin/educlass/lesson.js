module.exports = [
  [
    // 上课记录
    'GET',
    ['/v4/vis/edu/educlass/records.json'],
    'edu-admin.educlass.LessonController',
    'getRecordsJson',
  ],
];
