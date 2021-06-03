export const SIGN_STATUS = {
  VALID: 0,
  DONE: 1,
  OVERTIME: 2,
  NOTSTART: 3,
  SHORTAGE: 4,
};

export const SIGN_DESC = {
  [SIGN_STATUS.VALID]: '可以签到',
  [SIGN_STATUS.DONE]: '已签到',
  [SIGN_STATUS.OVERTIME]: '超出可签到时间',
  [SIGN_STATUS.NOTSTART]: '未到签到时间',
  [SIGN_STATUS.SHORTAGE]: '课时不足',
};
