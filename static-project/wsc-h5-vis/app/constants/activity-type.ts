/**
 * 活动类型
 */
export enum ACTIVITY_TYPE {
  /** 没有活动（前端默认传0,规则中填的） */
  NO_ACTIVITY = 0,
  /** 没有活动(ump传1代表无活动) */
  NONE = 1,
  /** 拼团 */
  GROUP_BUY = 4,
  /** 积分兑换 */
  POINTS_EXCHANGE = 5,
  /** 秒杀 */
  SEC_KILL = 6,
  /** 优惠套餐 */
  PACKAGE_BUY = 7,
  /** 会员折扣 */
  CUSTOMER_DISCOUNT = 10,
  /** 限时折扣 */
  TIME_LIMIT_DISCOUNT = 11,
  /** 送礼 */
  GIFT = 14,
  /** 推荐有奖 */
  RECOMMEND_GIFT = 22,
  /** 满减送 */
  MEET_REDUCE = 101,
};
