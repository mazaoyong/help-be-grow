module.exports = [
  [
    // 预约列表
    'GET',
    ['/v4/vis/edu/appointment/appointmentList.json'],
    'edu-admin.appointment.AppointmentController',
    'getAppointmentListJson',
  ],
  [
    // 导出预约列表
    'POST',
    ['/v4/vis/edu/appointment/export.json'],
    'edu-admin.appointment.AppointmentController',
    'exportJson',
  ],
  [
    // 预约看板
    'GET',
    ['/v4/vis/edu/appointment/appointmentKanban.json'],
    'edu-admin.appointment.AppointmentController',
    'getAppointmentKanbanJson',
  ],
  [
    // 新建预约
    'POST',
    ['/v4/vis/edu/appointment/appointment.json'],
    'edu-admin.appointment.AppointmentController',
    'createAppointmentJson',
  ],
  [
    // 新建试听预约
    'POST',
    ['/v4/vis/edu/appointment/auditionAppointment.json'],
    'edu-admin.appointment.AppointmentController',
    'createAuditionAppointment',
  ],
  [
    // 确认预约
    'PUT',
    ['/v4/vis/edu/appointment/appointment.json'],
    'edu-admin.appointment.AppointmentController',
    'confirmAppointmentJson',
  ],
  [
    // 删除预约
    'DELETE',
    ['/v4/vis/edu/appointment/appointment.json'],
    'edu-admin.appointment.AppointmentController',
    'cancelAppointmentJson',
  ],
  [
    // 获取预约信息
    'get',
    ['/v4/vis/edu/appointment/appointment.json'],
    'edu-admin.appointment.AppointmentController',
    'getAppointmentJson',
  ],
  [
    // 获取地址
    'get',
    ['/v4/vis/edu/appointment/storeList.json'],
    'edu-admin.appointment.AppointmentController',
    'getStoreListJson',
  ],
  [
    // 线索页B端机构查询学生课表
    'GET',
    '/v4/vis/edu/appointment/findStudentLessonsForClue.json',
    'edu-admin.appointment.AppointmentController',
    'findStudentLessonsForClue',
  ],
  [
    // 学员B端机构查询学生课表
    'GET',
    '/v4/vis/edu/appointment/findStudentLessonsByIdentity.json',
    'edu-admin.appointment.AppointmentController',
    'findStudentLessonsByIdentity',
  ],
  [
    // 获取学员锁定资产
    'GET',
    '/v4/vis/edu/appointment/findPageStudentLessonByAssetNo.json',
    'edu-admin.appointment.AppointmentController',
    'findPageStudentLessonByAssetNo',
  ],
  [
    // 批量解锁学员资产
    'POST',
    '/v4/vis/edu/appointment/batchCancelV2.json',
    'edu-admin.appointment.AppointmentController',
    'batchCancelV2',
  ],
  [
    // 修改预约时的详情获取
    'GET',
    '/v4/vis/edu-admin/appointment/getStudentLessonForUpdate.json',
    'edu-admin.appointment.AppointmentController',
    'getStudentLessonForUpdate',
  ],
  [
    // 更新预约
    'POST',
    '/v4/vis/edu-admin/appointment/updateStudentLesson.json',
    'edu-admin.appointment.AppointmentController',
    'updateStudentLesson',
  ],
  [
    // 获取更新预约结果
    'GET',
    '/v4/vis/edu-admin/appointment/getUpdateAppointmentResult.json',
    'edu-admin.appointment.AppointmentController',
    'getUpdateAppointmentResult',
  ],
];
