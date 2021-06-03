/* eslint-disable no-unused-vars */

const RewardIcon = {
  present: 'https://img01.yzcdn.cn/upload_files/2020/11/30/Ftu_AhLrGpFCRDmaFi6ETOfRJcTI.png',
  coupon: 'https://img01.yzcdn.cn/upload_files/2020/11/30/Fqfh8RY1TglZlLAVGYV_ao_fWJiD.png',
  point: 'https://img01.yzcdn.cn/upload_files/2020/11/30/FvEP4EaR-qwlWhKGm8XltQlAhywe.png',
};

enum CouponTypeEnum {
  /** 无码凭证活动（优惠券） */
  CARD = 7,
  /** 唯一码凭证活动 */
  UNIQUE_CODE = 9,
  /** 共享码凭证活动 */
  SHARED_CODE,
  /** 社区团购券 */
  GROUPBUY_CARD,
  /** 三方券 */
  THIRDPARTY_CARD,
  /** 兑换券 */
  EXCHANGE_CARD,
  /** 有赞客优惠券 */
  YOUZANKE_CARD,
}

enum PreferentialTypeEnum {
  COUPON = 1,
  DISCOUNT_COUPON,
}

export {
  CouponTypeEnum,
  PreferentialTypeEnum,
  RewardIcon,
};
