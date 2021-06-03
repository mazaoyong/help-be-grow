module.exports = [
  [
    'GET',
    '/v4/vis/edu/page/student',
    'student.student.StudentController',
    ['init', 'initTeamStatus', 'getIndexHtml'],
  ],

  // region
  [
    // 获取省级映射列表
    'GET',
    '/v4/vis/edu/student/region/province.json',
    'student.student.RegionController',
    'getProvinceMap',
  ],
  [
    // 获取城市映射列表
    'GET',
    '/v4/vis/edu/student/region/city.json',
    'student.student.RegionController',
    'getCityMap',
  ],
  [
    // 获取地区映射列表
    'GET',
    '/v4/vis/edu/student/region/county.json',
    'student.student.RegionController',
    'getCountyMap',
  ],

  // student
  [
    // 新增学员
    'POST',
    '/v4/vis/edu/student.json',
    'student.student.StudentController',
    'create',
  ],
  [
    // 学员详情
    'GET',
    '/v4/vis/edu/student.json',
    'student.student.StudentController',
    'detail',
  ],
  [
    // 根据学员id获取学员信息
    'GET',
    '/v4/vis/edu/getStudentInfoById.json',
    'student.student.StudentController',
    'getInfoByIdJson',
  ],
  [
    // 根据统一id获取学员信息
    'GET',
    '/v4/vis/edu/student/getInfoById.json',
    'student.student.StudentController',
    'getByNo',
  ],
  [
    // 根据学员id获取学员信息——手机号脱敏
    'GET',
    '/v4/vis/edu/getInfoByIdForHideJson.json',
    'student.student.StudentController',
    'getInfoByIdForHideJson',
  ],
  [
    // 根据学员id获取学员报名的课程信息
    'GET',
    '/v4/vis/edu/getStudentCoursies.json',
    'student.student.StudentController',
    'getCourseListByIdJson',
  ],
  [
    // 根据学员id获取学员学习记录
    'GET',
    '/v4/vis/edu/getCourseRecord.json',
    'student.student.StudentController',
    'getCourseRecordsByIdJson',
  ],
  [
    // 根据学员id获取学员报名的课表信息
    'GET',
    '/v4/vis/edu/getCourseSchedule.json',
    'student.student.StudentController',
    'getCourseScheduleJson',
  ],
  [
    // 根据学员手机号，分页查询学员的课程信息
    'GET',
    '/v4/vis/edu/student/findPageByMobileWithCourse.json',
    'student.student.StudentController',
    'findPageByMobileWithCourse',
  ],
  [
    // 根据学员手机号，分页查询学员的课程信息
    'GET',
    '/v4/vis/edu/student/findPageByQueryWithWrapCourse.json',
    'student.student.StudentController',
    'findPageByQueryWithWrapCourse',
  ],
  [
    // 根据学员id删除学员
    'PUT',
    '/v4/vis/edu/student/course/delete.json',
    'student.student.StudentController',
    'delete',
  ],
  [
    // 修改学员
    'PUT',
    '/v4/vis/edu/student/update.json',
    'student.student.StudentController',
    'updateStudent',
  ],
  [
    // 修改学员（新接口）
    'POST',
    '/v4/vis/edu/student/saveAttribute.json',
    'student.student.StudentController',
    'saveAttribute',
  ],
  [
    // 获取学员学习记录统计
    'GET',
    '/v4/vis/edu/student/statistics.json',
    'student.student.StudentController',
    'getStudyRecordStatistics',
  ],
  [
    // 设置有效时间
    'POST',
    '/v4/vis/edu/student/modifyAvailableTime.json',
    'student.student.StudentController',
    'modifyAvailableTime',
  ],
  [
    // 修改学员
    'PUT',
    '/v4/vis/edu/student.json',
    'student.student.StudentController',
    'update',
  ],
  [
    // 客户学员课表
    'GET',
    '/v4/vis/edu/student/course/list.json',
    'student.student.StudentController',
    'courseList',
  ],
  [
    // 查询学员一月课程
    'GET',
    '/v4/vis/edu/student/course/month.json',
    'student.student.StudentController',
    'findMonthCourse',
  ],
  [
    // 获取店铺学员列表
    'GET',
    '/v4/vis/edu/getStudentList.json',
    'student.student.StudentController',
    'getStudentListJson',
  ],
  [
    // 获取7天内生日的学员
    'GET',
    '/v4/vis/edu/getStudentListByBirthday.json',
    'student.student.StudentController',
    'getStudentListByBirthdayJson',
  ],
  [
    // 获取课时即将用尽的学员
    'GET',
    '/v4/vis/edu/getStudentListByRemainingHourNotEnough.json',
    'student.student.StudentController',
    'getStudentListByRemainingHourNotEnoughJson',
  ],
  [
    // 获取课时即将到期的学员
    'GET',
    '/v4/vis/edu/getStudentListByEndTimeNotEnough.json',
    'student.student.StudentController',
    'getStudentListByEndTimeNotEnoughJson',
  ],
  [
    // 获取7日内未上课的学员
    'GET',
    '/v4/vis/edu/getStudentListByUnusedAsset.json',
    'student.student.StudentController',
    'getStudentListByUnusedAssetJson',
  ],
  [
    // 查询某个店铺下的老师信息，不分页
    'GET',
    '/v4/vis/edu/shop/teacher/list.json',
    'student.student.StudentController',
    'getTeacherList',
  ],
  [
    // 根据条件查询网点信息，不分页
    'GET',
    '/v4/vis/edu/shop/store/list.json',
    'student.student.StudentController',
    'getStoreList',
  ],
  [
    // 课程商品交易统计
    'GET',
    '/v4/vis/edu/course/tradeInfo.json',
    'student.student.StudentController',
    'getTradeInfo',
  ],
  [
    // 查询学员所属校区信息列表
    'GET',
    '/v4/vis/edu/schoolListOfStudent.json',
    'student.student.StudentController',
    'getSchoolListOfStudent',
  ],
  [
    // 修改学员课时数检查
    'GET',
    '/v4/vis/edu/student/checkCourseTime.json',
    'student.student.StudentController',
    'checkCourseTime',
  ],
  [
    // 修改学员课时数
    'POST',
    '/v4/vis/edu/student/updateCourseTime.json',
    'student.student.StudentController',
    'updateCourseTime',
  ],
  [
    // 根据校区查找学员
    'GET',
    '/v4/vis/edu/student/findStudents.json',
    'student.student.StudentController',
    'getStudentListByKdtId',
  ],
  [
    // 根据校区查找学员
    'GET',
    '/v4/vis/student/student/findLockedPage.json',
    'student.student.StudentController',
    'findLockedPage',
  ],
  [
    // 查询签到提示内上课列表
    'GET',
    '/v4/vis/student/student/findLittlePage.json',
    'student.student.StudentController',
    'findLittlePage',
  ],
  [
    // 批量移除冻结课时
    'POST',
    '/v4/vis/student/student/batchCancel.json',
    'student.student.StudentController',
    'batchCancel',
  ],
  [
    // 根据学员查找联系人
    'GET',
    '/v4/vis/edu/student/getByStudentId.json',
    'student.student.StudentController',
    'getByStudentId',
  ],
  [
    // 根据学员id删除
    'POST',
    '/v4/vis/edu/student/delete.json',
    'student.student.StudentController',
    'deleteV2',
  ],
  [
    // 获取店铺学员列表V2
    'GET',
    '/v4/vis/edu/student/findPageByQueryV2.json',
    'student.student.StudentController',
    'findPageByQueryV2',
  ],
  [
    // 修改来源
    'POST',
    '/v4/vis/edu/student/modifySource.json',
    'student.student.StudentController',
    'modifySource',
  ],
  [
    // 检查是否是潜在学员
    'GET',
    '/v4/vis/edu/student/checkIsPotential.json',
    'student.student.StudentController',
    'checkIsPotential',
  ],
  [
    // 查询不同状态的学员统计信息
    'GET',
    '/v4/vis/edu/student/getStudentListPageStatistics.json',
    'student.student.StudentController',
    'getStudentListPageStatistics',
  ],
  [
    // 获取报读列表
    'GET',
    '/v4/vis/edu/student/findSignUpReadInfo.json',
    'student.student.StudentController',
    'findSignUpReadInfo'
  ]
];
