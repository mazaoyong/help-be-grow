export enum ShowCollectInfoEnum {
  HIDE,
  SHOW,
};

export enum NeedVerifyCodeEnum {
  UNNEED,
  NEED,
};

export const COLLECT_INFO_VALUE_CACHE = 'course-detail-collect-info-cache';

/** 支持快捷采集字段 */
export const QUICK_COLLECT_SUPPORT_KEYS = [
  // 学员姓名
  'edu_stuName',
  // 手机号
  'edu_stuContractPhone',
  // 生日
  'edu_stuBirth',
  // 年龄
  'edu_stuAge',
  // 性别
  'edu_stuSex',
  // 年级
  'edu_stuGrade',
  // 联系地址
  'edu_stuAddress',
  // 微信号
  'edu_stuContractWeChat',
];
