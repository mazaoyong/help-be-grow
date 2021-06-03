/** 课程有效期 */
export const VALID_PERIOD_TYPE = {
  /** 永久 */
  FOREVER: 1,
  /** 生效起N单位（如30天）内可用 */
  VALID_AFTER_COURSE: 2,
};

/** 有效期的单位 */
export const VALID_PERIOD_UNIT = {
  /** 天 */
  D: 1,
  /** 月 */
  M: 2,
  /** 季度 */
  S: 3,
  /** 年 */
  Y: 4,
};

export const VALID_PERIOD_UNIT_DESC = {
  [VALID_PERIOD_UNIT.D]: '天',
  [VALID_PERIOD_UNIT.M]: '月',
  [VALID_PERIOD_UNIT.S]: '季度',
  [VALID_PERIOD_UNIT.Y]: '年',
};
