/** 线下课类型 */
export const COURSE_TYPE = {
  /** 体验课 */
  CASUAL: 0,
  /** 正式课 */
  FORMAL: 1,
  /** 【新增特殊类型】B端课程设置 - 隐藏「体验课/正式课标签」 */
  HIDE_TAG: -1,
};

export const COURSE_TYPE_DESC = {
  [COURSE_TYPE.CASUAL]: '体验课',
  [COURSE_TYPE.FORMAL]: '正式课',
  [COURSE_TYPE.HIDE_TAG]: '',
};
