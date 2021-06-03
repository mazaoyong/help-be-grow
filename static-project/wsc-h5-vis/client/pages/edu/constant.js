// 课程有效期
export const VALID_PERIOD_TYPE = {
  FOREVER: 1, // 永久
  VALID_AFTER_COURSE: 2, // 生效起N单位（如30天）内可用
};

// 有效期的单位
export const VALID_PERIOD_UNIT = {
  D: 1,
  M: 2,
  S: 3,
  Y: 4,
};

// 有效期的单位描述
export const VALID_PERIOD_UNIT_DESC = {
  [VALID_PERIOD_UNIT.D]: '天',
  [VALID_PERIOD_UNIT.M]: '月',
  [VALID_PERIOD_UNIT.S]: '季度',
  [VALID_PERIOD_UNIT.Y]: '年',
};

// 有效期
export const VALID_PERIOD_DESC = {
  [VALID_PERIOD_TYPE.FOREVER](num, unit) {
    return '';
  },
  [VALID_PERIOD_TYPE.VALID_AFTER_COURSE](num, unit) {
    return `生效起${num}${VALID_PERIOD_UNIT_DESC[unit] || ''}内可用`;
  },
};

// 线下课销售类型
export const COURSE_SELL_TYPE = {
  COUNT: 1, // 按课时
  DURATION: 2, // 按时段
  SESSION: 3, // 按期
  DIY: 0, // 自定义
};

// 线下课类型
export const COURSE_TYPE = {
  CASUAL: 0, // 体验课
  FORMAL: 1, // 正式课
};

// 生效时间类型
export const COURSE_EFFECTIVE_TYPE = {
  AFTER_SIGN: 1, // 首次签到后生效
  AFTER_BUY_PERIOD: 2, // 付款N天（如2天）后有效
  AFTER_BUY: 3, // 购买后立即生效
};

// 生效时间
export const COURSE_EFFECTIVE_DESC = {
  [COURSE_EFFECTIVE_TYPE.AFTER_SIGN](num) {
    return '首次上课签到后生效';
  },
  [COURSE_EFFECTIVE_TYPE.AFTER_BUY_PERIOD](num) {
    return `付款${num}天后生效`;
  },
  [COURSE_EFFECTIVE_TYPE.AFTER_BUY](num) {
    return '付款后生效';
  },
};

export const SERVICE_PLEDGE = {
  UNSEEN: 0,
  FREE_APPOINTMENT: 1,
  CHECK_AGAIN: 2,
};

// 好友助力活动升级上线时间 2019/11/26 00:00
export const COLLECT_ZAN_UPGRADING_ONLINE_TIME = 1574697600000;

export const STUDENT_CHECK_CODE = {
  /**
     * 通过校验
     */
  PASS: 0,

  //= ===============已在 or 结束【1-9】====================

  /**
     * 学员已在本日程
     */
  ALREADY_IN_LESSON: 1,

  /**
     * 学员已在本班级
     */
  ALREADY_IN_CLASS: 2,

  /**
     * 日程已经结束
     */
  LESSON_FINISH: 3,

  //= ===================资产类型【10-19】========================

  /**
     * 自定义资产未设置有效期
     */
  CUSTOM_ASSET_NOT_SETTING: 10,

  /**
     * 按期销售的资产
     */
  PERIOD_ASSET: 11,

  //= ===================有效期【20-29】========================

  /**
     * 资产开始时间>日程开始时间
     */
  ASSET_TIME_AFTER_LESSON: 20,

  /**
     * 资产结束时间<日程开始时间(班级开始时间)
     */
  ASSET_EXPIRE: 21,

  /**
     * 资产开始时间>班级结束时间
     */
  ASSET_TIME_AFTER_CLASS: 22,

  //= ===================课时【30-39】========================

  /**
     * 剩余课时(remaining+locked)<日程消耗课时
     */
  ASSET_REMAINING_NOT_ENOUGH: 30,

  /**
     * 剩余课时(remaining+locked)>=日程消耗课时 & remaining<日程消耗课时
     */
  ASSET_REMAINING_ENOUGH: 31,

  //= ===================名额【40-49】========================

  /**
     * 日程剩余名额不足
     */
  QUOTA_NOT_ENOUGH: 40,

  //= ===================其他【100-999】========================

  /**
     * 学员已被移除日程
     */
  STUDENT_REMOVED_FROM_LESSON: 100,
};
