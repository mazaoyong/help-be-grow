module.exports = [
  [
    // 线下课
    'GET',
    '/v4/vis/edu/course',
    'course.course.CourseProductController',
    ['initVisPage', 'getIndexHtml'],
  ],

  // 获取老师列表
  ['GET', '/v4/vis/edu/getTeacherList.json', 'course.course.TeacherController', 'getTeacherListJson'],
  // 获取老师列表（分页）
  ['GET', '/v4/vis/edu/getTeacherListByPage.json', 'edu-admin.teacher.TeacherController', 'findTeachers'],

  // 获取上课地点
  ['GET', '/v4/vis/edu/getStoreList.json', 'course.course.StoreController', 'getStoreListJson'],

  // pc端获取课程详情 TOCLEAR 这个还有流量，先留着
  [
    'GET',
    '/v4/vis/edu/course/getCoursePCDetail.json',
    'course.course.CourseController',
    'getCoursePCDetailJson',
  ],

  [
    'GET',
    '/v4/vis/edu/course/getRegisterInfo.json',
    'course.course.StudentController',
    'getRegisterInfo',
  ],

  [
    'GET',
    '/v4/vis/edu/course/getAllCourseList.json',
    'course.course.CourseProductV2Controller',
    'findPageByConditionForWym',
  ],

  [
    'GET',
    '/v4/vis/edu/course/getCourseTagsByAlias.json',
    'course.course.CourseProductV2Controller',
    'findCourseTagsByAlias',
  ],
  [
    'GET',
    '/v4/vis/edu/course/findEduClassByCondition.json',
    'course.course.CourseController',
    'findEduClassByCondition',
  ],
];
