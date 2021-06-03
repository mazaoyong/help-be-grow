/**
 * 活动类型
 */
export const ACTIVITY_TYPE = {
  /** 没有活动（前端默认传0,规则中填的） */
  NO_ACTIVITY: 0,
  /** 没有活动(ump传1代表无活动) */
  NONE: 1,
  /** 拼团 */
  GROUP_BUY: 4,
  /** 阶梯拼团 */
  LADDER_GROUP: 26,
  /** 积分兑换 */
  POINTS_EXCHANGE: 5,
  /** 秒杀 */
  SEC_KILL: 6,
  /** 优惠套餐 */
  PACKAGE_BUY: 7,
  /** 会员折扣 */
  CUSTOMER_DISCOUNT: 10,
  /** 限时折扣 */
  TIME_LIMIT_DISCOUNT: 11,
  /** 送礼 */
  GIFT: 14,
  /** 推荐有奖 */
  RECOMMEND_GIFT: 22,
  /** 阶梯拼团 */
  LADDER_GROUPON: 26,
  /** 满减送 */
  MEET_REDUCE: 101,
  /** 优惠券 */
  COUPON: 105,
  /** 买赠 */
  KNOWLEDGE_MEET_REDUCE: 255,
  /** 企业微信加好友让利涨粉（交易时不需要这个场景，前端暂时用99965） */
  WECOM_FANS_BENEFIT: 99965,
  /** 公众号涨粉（交易时不需要这个场景，前端暂时用99996） */
  FANS_BENEFIT: 99996,
  /** 分销员（交易时不需要这个场景，前端暂时用99997） */
  INVITE: 99997,
  /** 请好友看（交易时不需要这个场景，前端暂时用99998） */
  SHARE: 99998,
  /** 好友助力（交易时不需要这个场景，前端暂时用99999） */
  COLLECT_ZAN: 99999,
  /** 攒学费 */
  TUITION: 259,
};

export const ACTIVITY_TYPE_STR = {
  groupon: ACTIVITY_TYPE.GROUP_BUY,
  ladderGroupOn: ACTIVITY_TYPE.LADDER_GROUPON,
  timelimitedDiscount: ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT,
  seckill: ACTIVITY_TYPE.SEC_KILL,
  packageBuy: ACTIVITY_TYPE.PACKAGE_BUY,
  meetReduce: ACTIVITY_TYPE.KNOWLEDGE_MEET_REDUCE,
  collectZan: ACTIVITY_TYPE.COLLECT_ZAN,
  gift: ACTIVITY_TYPE.GIFT,
  share: ACTIVITY_TYPE.SHARE,
  recommendPolite: ACTIVITY_TYPE.RECOMMEND_GIFT,
  invite: ACTIVITY_TYPE.INVITE,
  vip: ACTIVITY_TYPE.CUSTOMER_DISCOUNT,
  pointsGoods: ACTIVITY_TYPE.POINTS_EXCHANGE,
  fansBenefit: ACTIVITY_TYPE.FANS_BENEFIT,
  tuition: ACTIVITY_TYPE.TUITION,
  coupon: ACTIVITY_TYPE.COUPON,
  wecomFansBenefit: ACTIVITY_TYPE.WECOM_FANS_BENEFIT,

};

/* 活动组合下单 */
export const COMPOSIITON_MAP = {
  // [ACTIVITY_TYPE.TUITION]: [
  //   ACTIVITY_TYPE.TUITION,
  //   ACTIVITY_TYPE.GIFT,
  //   ACTIVITY_TYPE.RECOMMEND_GIFT,
  // ],
  [ACTIVITY_TYPE.RECOMMEND_GIFT]: [
    ACTIVITY_TYPE.RECOMMEND_GIFT,
    // ACTIVITY_TYPE.TUITION,
  ],
};
