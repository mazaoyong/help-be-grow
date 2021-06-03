module.exports = [
  [
    // 查询预约列表
    'GET',
    '/v4/vis/edu/reserve/activityCode.json',
    'edu-admin.appointment.reserve.ActivitiesQrCodeController',
    'getActivityName',
  ],

  [
    // tab 首页
    'GET',
    ['/v4/vis/edu/page/appointment'],
    'edu-admin.appointment.reserve.PageController',
    'getIndexHtml',
  ],
  [
    // 预约老路由
    'GET',
    ['/v4/vis/edu/reserve'],
    'edu-admin.appointment.reserve.PageController',
    'getOldIndexHtml',
  ],

  [
    // 查询预约列表
    'POST',
    '/v4/vis/edu/reserve/list.json',
    'edu-admin.appointment.reserve.CourseScheduleController',
    'getListJson',
  ],
  [
    // 查询预约看板
    'POST',
    '/v4/vis/edu/reserve/courseScheduleKanban.json',
    'edu-admin.appointment.reserve.CourseScheduleController',
    'getCourseScheduleKanbanJson',
  ],
  [
    // 查询不同预约状态的数量
    'POST',
    '/v4/vis/edu/reserve/countStatus.json',
    'edu-admin.appointment.reserve.CourseScheduleController',
    'getCountStatusJson',
  ],
  [
    // 导出列表数据
    'POST',
    '/v4/vis/edu/reserve/exportData.json',
    'edu-admin.appointment.reserve.CourseScheduleController',
    'exportDataJson',
  ],
  [
    // 新增预约
    'POST',
    '/v4/vis/edu/reserve/reserve.json',
    'edu-admin.appointment.reserve.CourseScheduleController',
    'addReserveJson',
  ],
  [
    // 更新预约
    'PUT',
    '/v4/vis/edu/reserve/reserve.json',
    'edu-admin.appointment.reserve.CourseScheduleController',
    'updateReserveJson',
  ],
  [
    // 获取课程列表
    'GET',
    '/v4/vis/edu/reserve/courseList.json',
    'edu-admin.appointment.reserve.CourseProductController',
    'getCourseListJson',
  ],
  [
    // 查询课程详情
    'GET',
    '/v4/vis/edu/reserve/coursePCDetail.json',
    'edu-admin.appointment.reserve.CourseController',
    'getCoursePCDetailJson',
  ],

  // 手机号模糊查询客户信息列表
  [
    'GET',
    '/v4/vis/edu/reserve/searchCustomerByPhoneNum.json',
    'edu-admin.appointment.reserve.CustomerController',
    'searchCustomerByPhoneNumJson',
  ],
  // 创建客户
  [
    'POST',
    '/v4/vis/edu/reserve/createCustomer.json',
    'edu-admin.appointment.reserve.CustomerController',
    'createCustomerJson',
  ],
  // 批量签到
  [
    'POST',
    '/v4/vis/edu-admin/reserve/signin.json',
    'edu-admin.appointment.reserve.SignInController',
    'businessBatchSignIn',
  ],
  // 单个签到
  [
    'POST',
    '/v4/vis/edu-admin/reserve/studentLessonsSignIn.json',
    'edu-admin.appointment.reserve.SignInController',
    'studentLessonsSignIn',
  ],
  // 获取商铺列表
  [
    'GET',
    '/v4/vis/edu/reserve/getStoreList.json',
    'edu-admin.appointment.reserve.StoreController',
    'getStoreListJson',
  ],

  // 获取学生列表
  [
    'GET',
    '/v4/vis/edu/reserve/customerStudentList.json',
    'edu-admin.appointment.reserve.StudentController',
    'getCustomerStudentListJson',
  ],
  // 新建学生
  [
    'POST',
    '/v4/vis/edu/reserve/createStudent.json',
    'edu-admin.appointment.reserve.StudentController',
    'createStudentJson',
  ],
  // 查找日程下学员列表
  [
    'GET',
    '/v4/vis/edu/reserve/studentBySchedule.json',
    'edu-admin.appointment.reserve.StudentController',
    'findPageByQueryWithSingleSchedule',
  ],

  // 获取老师列表
  [
    'GET',
    '/v4/vis/edu/reserve/getTeacherList.json',
    'edu-admin.appointment.reserve.TeacherController',
    'getTeacherListJson',
  ],
  // 单个签到提示
  [
    'GET',
    '/v4/vis/edu-admin/reserve/getSignInTip.json',
    'edu-admin.appointment.reserve.SignInController',
    'getSignInTip',
  ],
  // 批量签到提示
  [
    'GET',
    '/v4/vis/edu-admin/reserve/getBatchSignInTip.json',
    'edu-admin.appointment.reserve.SignInController',
    'getBatchSignInTip',
  ],
];
