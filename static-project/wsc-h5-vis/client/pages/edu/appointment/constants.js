export const CANCEL_TYPE = {
  ALLOWED: 0,
  NOT_ALLOWED: 1,
};

export const APPOINTMENT_STATUS = {
  VALID: 0,
  EXISTED: 1,
  NO_NEED: 2,
  TOO_EARLY: 3,
  TOO_LATE: 4,
  FULLFILLED: 5,
};

// 课程销售类型
export const COURSE_SELL_TYPE = {
  TIMES: 1,
  PERIOD: 2,
  CUSTOM: 0,
};

export const ASSET_VALID_TYPE = {
  FOREVER: 0, // 永久有效
  FIXED: 1, // 固定有效期
  LOCKED: 2, // 锁定资产时生效
  USED: 3, // 消耗资产时生效
  CUSTOM: 100, // 自定义设置有效期
};

// 课程有效期单位
export const COURSE_VALIDITY_UNIT = [
  '课时',
  '天',
  '周',
  '月',
  '年',
];
