const COMMON_SIGNIN_CONTROLLER = 'edu-admin.signin.SigninController';
const COMMON_SIGNIN_PAGES_PREFIX = '/v4/vis/edu/page/new-signin';
const COMMON_SIGNIN_API_PREFIX = '/v4/vis/edu/signin';
const SIGNIN_SCHEDULE_API_PREFIX = '/v4/vis/edu/schedule';

module.exports = [
  [
    'GET',
    COMMON_SIGNIN_PAGES_PREFIX + '/*',
    COMMON_SIGNIN_CONTROLLER,
    ['initVisPage', 'getIndexHtml'],
  ],
  ['GET', COMMON_SIGNIN_PAGES_PREFIX, COMMON_SIGNIN_CONTROLLER, ['initVisPage', 'getIndexHtml']],
  [
    'GET',
    COMMON_SIGNIN_API_PREFIX + '/records.json',
    COMMON_SIGNIN_CONTROLLER,
    ['findSignInRecords'],
  ],
  [
    'POST',
    COMMON_SIGNIN_API_PREFIX + '/settings.json',
    COMMON_SIGNIN_CONTROLLER,
    ['createSignInCodeSetting'],
  ],
  [
    'PUT',
    COMMON_SIGNIN_API_PREFIX + '/settings.json',
    COMMON_SIGNIN_CONTROLLER,
    ['updateSignInCodeSetting'],
  ],
  [
    'GET',
    COMMON_SIGNIN_API_PREFIX + '/settings.json',
    COMMON_SIGNIN_CONTROLLER,
    ['getSignInCodeSetting'],
  ],
  // 获取学员签到历史记录
  [
    'GET',
    COMMON_SIGNIN_API_PREFIX + '/getSignInRecordHistory.json',
    COMMON_SIGNIN_CONTROLLER,
    'getSignInRecordHistory',
  ],
  // 获取签到记录统计信息
  [
    'GET',
    COMMON_SIGNIN_API_PREFIX + '/getSignInListSummary.json',
    COMMON_SIGNIN_CONTROLLER,
    'getSignInListSummary',
  ],
  // 签到页面日程表操作相关API
  [
    // 移除学员
    'DELETE',
    SIGNIN_SCHEDULE_API_PREFIX + '/detail/removeStudent.json',
    COMMON_SIGNIN_CONTROLLER,
    'remove',
  ],
  [
    // 修改签到状态
    'PUT',
    SIGNIN_SCHEDULE_API_PREFIX + '/detail/modifyStatus.json',
    COMMON_SIGNIN_CONTROLLER,
    'modifyStatus',
  ],
  // 排课导出签到报表
  [
    'POST',
    SIGNIN_SCHEDULE_API_PREFIX + '/detail/exportScheduleRecords.json',
    COMMON_SIGNIN_CONTROLLER,
    'exportDayOfSignTable',
  ],
  // 签到导出签到报表
  [
    'POST',
    SIGNIN_SCHEDULE_API_PREFIX + '/detail/exportSignInRecords.json',
    COMMON_SIGNIN_CONTROLLER,
    'exportRecord',
  ],
];
