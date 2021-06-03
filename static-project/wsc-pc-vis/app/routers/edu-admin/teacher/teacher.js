// 老师
module.exports = [
  [
    'GET',
    '/v4/vis/edu/teacher/findTeachers.json',
    'edu-admin.teacher.TeacherController',
    'findTeachers',
  ],
  [
    'GET',
    '/v4/vis/edu/shop/listTeacherForWym.json',
    'edu-admin.teacher.TeacherController',
    'listTeacherForWym',
  ],
  [
    'GET',
    '/v4/vis/edu-admin/teacher/findPage.json',
    'edu-admin.teacher.TeacherController',
    'getFindPageJson',
  ],
  [
    'GET',
    '/v4/vis/edu-admin/teacher/findAssistantPage.json',
    'edu-admin.teacher.TeacherController',
    'getFindAssistantPageJson',
  ],
];
