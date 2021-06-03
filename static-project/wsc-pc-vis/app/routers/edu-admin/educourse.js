module.exports = [
  ['GET', '/v4/vis/edu/page/educourse', 'edu-admin.EduCourseController', [ 'initVisPage', 'getIndexHtml' ]],
  // 获取课程列表
  [
    'GET',
    '/v4/vis/edu/eduCourse/getEduCourseList.json',
    'edu-admin.EduCourseController',
    'getEduCourseListJson',
  ],

  // 通过ID获取课程
  ['GET', '/v4/vis/edu/eduCourse/eduCourse.json', 'edu-admin.EduCourseController', 'getById'],

  // 创建课程
  [
    'POST',
    '/v4/vis/edu/eduCourse/eduCourse.json',
    'edu-admin.EduCourseController',
    'createEduCourse',
  ],

  // 更新课程
  [
    'PUT',
    '/v4/vis/edu/eduCourse/eduCourse.json',
    'edu-admin.EduCourseController',
    'updateEduCourse',
  ],

  // 删除课程
  [
    'DELETE',
    '/v4/vis/edu/eduCourse/eduCourse.json',
    'edu-admin.EduCourseController',
    'deleteEduCourse',
  ],
  // 查看课程重名
  [
    'GET',
    '/v4/vis/edu/eduCourse/checkCourseName.json',
    'edu-admin.EduCourseController',
    'checkCourseName',
  ],

  // 通过ID获取课程——支持连锁
  ['GET', '/v4/vis/edu/eduCourse/getByIdV2.json', 'edu-admin.EduCourseController', 'getByIdV2'],

  // 通过ID获取校区列表
  ['GET', '/v4/vis/edu/eduCourse/findPageByEduCourse.json', 'edu-admin.EduCourseController', 'findPageByEduCourse'],

  // 校验校区是否可以删除
  ['GET', '/v4/vis/edu/eduCourse/checkEduCourse.json', 'edu-admin.EduCourseController', 'checkEduCourse'],

  // 删除课程——支持连锁
  [
    'POST',
    '/v4/vis/edu/eduCourse/deleteEduCourseV2.json',
    'edu-admin.EduCourseController',
    'deleteEduCourseV2',
  ],
];
