
// 体验课来源
export const RESERVE_SOURCE = {
  2: '线上预约',
  3: '手动录入',
  4: '线上预约',
};

export const RESERVE_STATUS_MAP = [
  '待确认',
  '待上课',
  '',
  '已签到',
  '已取消',
  '未到',
  '请假',
];

export const RESERVE_STATUS_COLOR_MAP = [
  ['#D40000', '#F1924E', '#FFEBEB'],
  ['#3AB854', '#66BE74', '#F0FAF2'],
  ['', '', ''],
  ['#1571DE', '#5487DF', '#EDF4FF'],
  ['#4A4A4C', '#C8C9CC', '#F2F3F5'],
  ['#1571DE', '#5487DF', '#EDF4FF'],
  ['#1571DE', '#5487DF', '#EDF4FF'],
];

export const APPOINTMENT_STATUS_TYPE = {
  TO_BE_CONFIRMED: 1, // 待确认
  TO_BE_PERFORMED: 2, // 待上课

  /* 以下属于 已上课 */
  COMPLETED: 4, // 已完成
  ABSENCE: 6, // 已缺席
  ASK_FOR_LEAVED: 7, // 已请假
  /* 以上属于 已上课 */

  CANCELLED: 5, // 已取消
};
