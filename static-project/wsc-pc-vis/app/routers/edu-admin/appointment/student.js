module.exports = [
  [
    // 学员列表 可提供更多查询条件
    'GET',
    ['/v4/vis/edu/appointment/students.json'],
    'edu-admin.appointment.StudentController',
    'getStudentsJson',
  ],
];
