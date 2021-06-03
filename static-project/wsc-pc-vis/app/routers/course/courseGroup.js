module.exports = [
  [
    'GET',
    ['/v4/vis/edu/page/courseGroup', '/v4/vis/pct/page/courseGroup'],
    'course.course-group.CourseGroupController',
    'redirectToNewUrl',
  ],
  [
    'GET',
    ['/v4/vis/course/group/list'],
    'course.course-group.CourseGroupController',
    'getIndexHtml',
  ],
  [
    'GET',
    ['/v4/vis/course/group/add', '/v4/vis/course/group/edit/:id'],
    'course.course-group.CourseGroupController',
    'getEditHtml',
  ],
  [
    'GET',
    ['/v4/vis/course/group/manage/:groupId'],
    'course.course-group.CourseGroupController',
    'getManageHtml',
  ],
  [
    'GET',
    '/v4/vis/edu/page/courseGroup/list.json',
    'course.course-group.CourseGroupController',
    'getList',
  ],
  [
    'GET',
    '/v4/vis/edu/page/courseGroup/getQrCode.json',
    'course.course-group.CourseGroupController',
    'getQrCodeByAlias',
  ],
  [
    'POST',
    '/v4/vis/edu/page/courseGroup/deleteGroup.json',
    'course.course-group.CourseGroupController',
    'deleteGroupById',
  ],
  [
    'GET',
    '/v4/vis/edu/page/courseGroup/getCourseListByGroup.json',
    'course.course-group.CourseGroupController',
    'getCourseListByGroup',
  ],
  [
    'GET',
    '/v4/vis/edu/page/courseGroup/getCourseList.json',
    'course.course-group.CourseGroupController',
    'getCourseList',
  ],
  [
    'POST',
    '/v4/vis/edu/page/courseGroup/addCourseToGroup.json',
    'course.course-group.CourseGroupController',
    'addCourseToGroup',
  ],
  [
    'POST',
    '/v4/vis/edu/page/courseGroup/removeCourseFromGroup.json',
    'course.course-group.CourseGroupController',
    'removeCourseFromGroup',
  ],
  [
    'POST',
    '/v4/vis/edu/page/courseGroup/batchModifyCourseGroup.json',
    'course.course-group.CourseGroupController',
    'batchModifyCourseGroup',
  ],

  // ################## move from course-group-decorator
  // 课程分组页面
  [
    'GET',
    '/v4/vis/edu/page/course-group-decorate',
    'course.course-group.CourseGroupController',
    'redirectToNewEditUrl',
  ],

  // 创建课程分组
  [
    'POST',
    ['/v4/vis/course-group/create.json/textarea', '/v4/vis/course-group/_textarea_/create.json'],
    'course.course-group.CourseGroupController',
    'createCourseGroup',
  ],

  // 更新课程分组
  [
    'POST',
    ['/v4/vis/course-group/update.json/textarea', '/v4/vis/course-group/_textarea_/update.json'],
    'course.course-group.CourseGroupController',
    'updateCourseGroup',
  ],

  // 获取课程分组详情
  [
    'GET',
    '/v4/vis/course-group/detail.json',
    'course.course-group.CourseGroupController',
    'getCourseGroupDetail',
  ],

  // ################## move from old course-group-controller
  // 分页获取分组列表
  [
    'GET',
    '/v4/vis/course-group/listCourseGroup.json',
    'course.course-group.CourseGroupController',
    'listCourseGroup',
  ],
];
