module.exports = [
  // 请求html
  [
    'GET',
    '/v4/vis/edu/page/regis/record',
    'recruit.regis.RecordController',
    ['initUserInfo', 'getIndexHtml'],
  ],

  // 查询学员资料项列表
  [
    'GET',
    '/v4/vis/edu/regis/record/findDataItems.json',
    'recruit.regis.RecordController',
    'findDataItems',
  ],

  // 分页查询报名记录列表
  [
    'GET',
    '/v4/vis/edu/regis/record/findPageRegistrationInfo.json',
    'recruit.regis.RecordController',
    'findPageRegistrationInfo',
  ],

  // 分页查询来源微页面列表
  [
    'GET',
    '/v4/vis/edu/regis/record/findPageRegFeature.json',
    'recruit.regis.RecordController',
    'findPageRegFeature',
  ],

  // 报表批量导出
  ['GET', '/v4/vis/edu/regis/record/createExportRecord.json', 'recruit.regis.RecordController', 'createExportRecord'],

  // 创建预约
  [
    'POST',
    '/v4/vis/edu/regis/record/createPreAppointment.json',
    'recruit.regis.RecordController',
    'createPreAppointment',
  ],
  // 线索创建预约
  [
    'POST',
    '/v4/vis/edu/regis/record/createPreAppointmentForClue.json',
    'recruit.regis.RecordController',
    'createPreAppointmentForClue',
  ],
];
