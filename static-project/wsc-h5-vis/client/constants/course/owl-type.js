/** 知识付费商品类型 */
export const OWL_TYPE = {
  /** 专栏 */
  COLUMN: 1,
  /** 内容 */
  CONTENT: 2,
  /** 权益包 */
  BENEFIT: 3,
  /** 直播 */
  LIVE: 4,
  /** 圈子 */
  CIRCLE: 5,
  /** 线下课 */
  COURSE: 10,
};

export const OWL_TYPE_DESC = {
  [OWL_TYPE.COLUMN]: '专栏',
  [OWL_TYPE.CONTENT]: '内容',
  [OWL_TYPE.LIVE]: '直播',
  [OWL_TYPE.COURSE]: '课程',
  // 以下映射暂时未用到，可以修改
  [OWL_TYPE.BENEFIT]: '权益包',
  [OWL_TYPE.CIRCLE]: '圈子',
};
