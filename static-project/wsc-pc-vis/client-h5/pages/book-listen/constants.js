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

export const APPOINTMENT_TYPE = {
  CREATE_TRY: 'create-try', // 试听场景下 - 创建预约
  CREATE_APPOINTMENT: 'create-appointment', // 预约场景下 - 创建预约
  EDIT_APPOINTMENT: 'edit-appointment', // 预约场景下 - 编辑
  EDIT_TRY: 'edit-try', // 试听场景下 - 编辑
  CONFIRM_TRY: 'confirm-try', // 试听场景下 - 确认预约
  CONFIRM_APPOINTMENT: 'confirm-appointment', // 预约场景下 - 确认预约
};
