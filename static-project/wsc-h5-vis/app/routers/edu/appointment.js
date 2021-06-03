module.exports = [
  ['GET', '/wscvis/edu/appointment/list', 'edu.RenderController', 'getAppointmentListHtml'],
  ['GET', '/wscvis/edu/appointment/create', 'edu.RenderController', 'getAppointmentCreateHtml'],
  ['GET', '/wscvis/edu/appointment/result', 'edu.RenderController', 'getAppointmentResultHtml'],
  ['GET', '/wscvis/edu/appointment/records', 'edu.RenderController', 'getAppointmentRecordsHtml'],
  ['GET', '/wscvis/edu/appointment/detail', 'edu.RenderController', 'getAppointmentDetailHtml'],

  // 获取预约课程
  [
    'GET',
    '/wscvis/edu/appointment/list.json',
    'edu.AppointmentController',
    'getList',
  ],

  // 获取学员信息
  [
    'GET',
    '/wscvis/edu/appointment/studentInfo.json',
    'edu.AppointmentController',
    'getStudentInfo',
  ],

  // 获取日历数据
  [
    'GET',
    '/wscvis/edu/appointment/calendar.json',
    'edu.AppointmentController',
    'getCalendar',
  ],

  // 查询具体某一天的机构课表及学员已预约的课表，可以通过条件进行筛选
  [
    'GET',
    '/wscvis/edu/appointment/listByDate.json',
    'edu.AppointmentController',
    'getListByDate',
  ],

  // 获取日历数据下单页
  [
    'GET',
    '/wscvis/edu/appointment/calendarForOrder.json',
    'edu.AppointmentController',
    'getCalendarForOrderPage',
  ],

  // 下单页
  // 查询具体某一天的机构课表及学员已预约的课表，可以通过条件进行筛选
  [
    'GET',
    '/wscvis/edu/appointment/listByDateForOrder.json',
    'edu.AppointmentController',
    'getListByDateForOrderPage',
  ],

  // 创建预约
  [
    'GET',
    '/wscvis/edu/appointment/create.json',
    'edu.AppointmentController',
    'getMakeAppointment',
  ],

  // 取消预约
  [
    'GET',
    '/wscvis/edu/appointment/cancel.json',
    'edu.AppointmentController',
    'getCancelAppointment',
  ],

  // 预约信息
  [
    'GET',
    '/wscvis/edu/appointment/info.json',
    'edu.AppointmentController',
    'getInfo',
  ],

  // 查询预约详情
  [
    'GET',
    '/wscvis/edu/appointment/detail.json',
    'edu.AppointmentController',
    'getDetail',
  ],

  // 查询预约记录
  [
    'GET',
    '/wscvis/edu/appointment/recordList.json',
    'edu.AppointmentController',
    'getRecordList',
  ],

  // 查询可预约状态
  [
    'GET',
    '/wscvis/edu/appointment/canTradeWithLessonAppointmentInfo.json',
    'edu.AppointmentController',
    'canTradeWithLessonAppointmentInfo',
  ],

  // 根据课程名称模糊搜索
  [
    'GET',
    '/wscvis/edu/appointment/findPageByCondition.json',
    'edu.AppointmentController',
    'findPageByCondition',
  ],

  // 用户合约时间冲突检测
  [
    'GET',
    '/wscvis/edu/appointment/conflict.json',
    'edu.AppointmentController',
    'detectDateRange',
  ],

  // 获取上课门店列表
  [
    'GET',
    '/wscvis/edu/appointment/getAddressList.json',
    'edu.AppointmentController',
    'getAddressList',
  ],
  // 获取全部老师列表
  [
    'GET',
    '/wscvis/edu/appointment/getTeacherList.json',
    'edu.AppointmentController',
    'getTeacherList',
  ],
];
