module.exports = [
  [
    // 学员列表
    'GET',
    ['/v4/vis/edu/educlass/studentsInClass.json'],
    'edu-admin.educlass.StudentController',
    'getStudentsInClassJson',
  ],
  [
    // 学员弹窗列表
    'GET',
    ['/v4/vis/edu/educlass/students.json'],
    'edu-admin.educlass.StudentController',
    'getStudentsJson',
  ],
];
