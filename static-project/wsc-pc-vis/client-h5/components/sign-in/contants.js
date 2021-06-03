export const CHECK_TEXT = {
  'sign-in': '已来上课',
  'leave': '已请假',
  'not-arrived': '没来上课',
};

export const CHECK_TYPE = {
  'sign-in': 0,
  'leave': 1,
  'not-arrived': 2,
};

export const CHECK_NAME = {
  'sign-in': '签到',
  'leave': '请假',
  'not-arrived': '未到',
};

export const SIGN_IN_TIP = {
  'sign-in': '签到',
  'leave': '标记请假',
  'not-arrived': '标记未到',
};

// 签到提示的类型
export const SIGN_IN_TYPE = {
  /**
     * 签到后生效，触发资产生效，扣课时，需移除日程
     */
  SIGN_IN_ACTIVE_CANCEL_CONSUME: 1,
  /**
     * 签到后生效，触发资产生效，扣课时，不移除日程
     */
  SIGN_IN_ACTIVE_CONSUME: 2,
  /**
     * 签到后生效，触发资产生效，不扣课时，移除日程
     */
  SIGN_IN_ACTIVE_CANCEL: 3,
  /**
     * 签到后生效，触发资产生效，不扣课时，不移除日程
     */
  SIGN_IN_ACTIVE: 4,
  /**
     * 签到后生效不触发资产生效或非签到生效，扣课时
     */
  SIGN_IN_CONSUME: 5,
  /**
     * 签到后生效不触发资产生效；非签到生效，不需扣课时/本节课消耗0课时，或按时段，按期，自定义
     */
  SIGN_IN: 6,
};

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

  /**
     * 其他原因导致
     */
  OTHER: 999,
};
