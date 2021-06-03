module.exports = [
  [
    // 班级列表
    'GET',
    ['/v4/vis/edu/educlass/courseList.json'],
    'edu-admin.educlass.EduCourseController',
    'getCourseListJson',
  ],
];
