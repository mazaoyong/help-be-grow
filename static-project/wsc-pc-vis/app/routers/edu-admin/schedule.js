module.exports = [
  [
    // 排课管理
    'GET',
    '/v4/vis/edu/page/schedule',
    'edu-admin.schedule.ScheduleController',
    'getIndexHTML',
  ],
  [
    // 获取课节看板
    'GET',
    '/v4/vis/edu/schedule/view.json',
    'edu-admin.schedule.ScheduleController',
    'findKanBanList',
  ],
  [
    // 获取课节看板
    'GET',
    '/v4/vis/edu/schedule/viewV2.json',
    'edu-admin.schedule.ScheduleController',
    'findKanBanListV2',
  ],
  [
    'GET',
    '/v4/vis/edu/schedule/findResourceKanBanPage.json',
    'edu-admin.schedule.ScheduleController',
    'findResourceKanBanPage',
  ],
  [
    'GET',
    '/v4/vis/edu/schedule/findResourceKanBanPageV2.json',
    'edu-admin.schedule.ScheduleController',
    'findResourceKanBanPageV2',
  ],
  [
    // 获取课节看板
    'GET',
    '/v4/vis/edu/schedule/list.json',
    'edu-admin.schedule.ScheduleController',
    'findPageByCondition',
  ],
  [
    // 批量查询老师
    'GET',
    '/v4/vis/edu/schedule/teacherList.json',
    'edu-admin.teacher.TeacherController',
    'find',
  ],
  [
    // 删除课节
    'DELETE',
    '/v4/vis/edu/schedule/lesson.json',
    'edu-admin.schedule.ScheduleController',
    'deleteLesson',
  ],
  [
    // 创建编辑排课获取课程列表
    'GET',
    '/v4/vis/edu/schedule/getCourseList.json',
    'edu-admin.schedule.ScheduleController',
    'getCourseListJson',
  ],
  [
    // 创建编辑排课获取班级列表
    'GET',
    '/v4/vis/edu/schedule/getCourseClass.json',
    'edu-admin.schedule.ScheduleController',
    'getCourseClassJson',
  ],
  [
    // 获取老师助教列表（带冲突检测）
    'GET',
    '/v4/vis/edu/schedule/getTeacherList.json',
    'edu-admin.schedule.ScheduleController',
    'getTeacherWithConflictJson',
  ],
  [
    // 获取上课门店列表
    'GET',
    '/v4/vis/edu/schedule/getClassStore.json',
    'edu-admin.schedule.ScheduleController',
    'getClassStoreJson',
  ],
  [
    // 获取教室列表（带冲突检测）（因按周排课可能需要传进很多时间段数据，使用GET会导致Header过长）
    'POST',
    '/v4/vis/edu/schedule/getClassroom.json',
    'edu-admin.schedule.ScheduleController',
    'getClassroomWithConflictJson',
  ],
  [
    // 提交创建排课信息之前检测冲突
    'POST',
    '/v4/vis/edu/schedule/validateBeforeModify.json',
    'edu-admin.schedule.ScheduleController',
    'validateBeforeSaveOrModify',
  ],
  [
    // 创建排课
    'POST',
    '/v4/vis/edu/schedule/create.json',
    'edu-admin.schedule.ScheduleController',
    'createSchedule',
  ],
  [
    // 编辑排课
    'POST',
    '/v4/vis/edu/schedule/update.json',
    'edu-admin.schedule.ScheduleController',
    'updateSchedule',
  ],
  [
    // 轮询新建/编辑排课的结果
    'GET',
    '/v4/vis/edu/schedule/getActionResult.json',
    'edu-admin.schedule.ScheduleController',
    'getActionResultJson',
  ],
  [
    // 获取排课信息
    'GET',
    '/v4/vis/edu/schedule/getScheduleDetail.json',
    'edu-admin.schedule.ScheduleController',
    'getScheduleDetailJson',
  ],
  [
    // 导出排课记录
    'POST',
    '/v4/vis/edu/schedule/export.json',
    'edu-admin.schedule.ScheduleController',
    'exportSchedules',
  ],
  [
    // 获取用户时间段配置
    'GET',
    '/v4/vis/edu/schedule/getDateRangeConfig.json',
    'edu-admin.schedule.ScheduleController',
    'getDateRangeConfig',
  ],
  [
    // 日程详情，增加学员信息
    'POST',
    '/v4/vis/edu/schedule/detail/student.json',
    'edu-admin.schedule.DetailController',
    'createStudentLesson',
  ],
  [
    // 日程详情，获取学员列表
    'GET',
    '/v4/vis/edu/schedule/detail/students.json',
    'edu-admin.schedule.DetailController',
    'findStuLessonByLessonNo',
  ],
  [
    // 日程详情，获取概况
    'GET',
    '/v4/vis/edu/schedule/detail/profile.json',
    'edu-admin.schedule.DetailController',
    'getKanBanDetail',
  ],
  [
    // 日程详情，获取统计数据
    'GET',
    '/v4/vis/edu/schedule/detail/statistic.json',
    'edu-admin.schedule.DetailController',
    'getStatisticalInfo',
  ],
  [
    'GET',
    '/v4/vis/edu/schedule/detail/excel.json',
    'edu-admin.schedule.DetailController',
    'getExcel',
  ],
  // 批量删除课节
  [
    'POST',
    '/v4/vis/edu-admin/schedule/batchDeleteLesson.json',
    'edu-admin.schedule.ScheduleController',
    'batchDeleteLesson',
  ],
  [
    'POST',
    '/v4/vis/edu-admin/schedule/batchRemoveStudent.json',
    'edu-admin.schedule.DetailController',
    'batchRemoveStudent',
  ],
];
