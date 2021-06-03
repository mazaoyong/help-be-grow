export const SIGN_STATUS = {
  NO_VALID_TIME: 0,
  WAIT_VALID: 1,
  VALID: 2,
  INVALID: 3,
  SHORTAGE: 4,
};

export const SIGN_DESC = {
  [SIGN_STATUS.NO_VALID_TIME]: '未设置有效期',
  [SIGN_STATUS.WAIT_VALID]: '未生效',
  [SIGN_STATUS.VALID]: '已生效',
  [SIGN_STATUS.INVALID]: '已失效',
  [SIGN_STATUS.SHORTAGE]: '课时不足',
};
