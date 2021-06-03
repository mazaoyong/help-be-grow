import accDiv from 'zan-utils/number/accDiv';

export enum CouponTypeEnum {
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

export enum PreferentialTypeEnum {
  COUPON = 1,
  DISCOUNT_COUPON,
}

/**
 * 单位装换函数
 * @param params
 * @param params.value 需要转换的值
 * @param params.divisor 转换倍数
 * @param params.fixed 需要保留的小数位数
 */

const unitConversion = (params: any) => {
  let { value, divisor, fixed } = params;
  if (typeof value !== 'number' || isNaN(value)) {
    value = 0;
  }
  return typeof fixed === 'number'
    ? accDiv(value, divisor).toFixed(fixed)
    : accDiv(value, divisor);
};

interface ActivityCoupon {
  couponValue: number;
  type?: CouponTypeEnum;
  condition?: number;
  valueRandomTo?: number;
  valueRandomFrom?: number;
  discount?: number;
  preferentialType?: PreferentialTypeEnum;
}

/**
 * 拼接活动返回优惠券名称
 *
 * @param {Object} item coupon
 * @return {string}  name
 *
 * 1张无门槛减3元优惠券，则展示“3元券 x1“
  1张无门槛打9折优惠券，则展示“9折券 x1”
  1张满90减20元优惠券，则展示“满90元减20元券 x1”
  1张满100打9折优惠券，则展示“满100打9折券 x1”
  1张商品兑换券，则展示“兑换指定商品券 x1”
  1张随机券，则展示“随机减X-Y元券 x1
  1张优惠码，则展示“「优惠券条件」优惠码 x1”
 */
export default function getCouponName(item: ActivityCoupon) {
  const {
    type,
    condition,
    couponValue,
    valueRandomTo,
    valueRandomFrom,
    discount,
    preferentialType,
  } = item;

  if (type === CouponTypeEnum.EXCHANGE_CARD) {
    return '兑换指定商品';
  }

  const isNoLimit = !condition;
  const isRandomCoupon = !!valueRandomTo;
  const isDiscountCoupon =
    preferentialType === PreferentialTypeEnum.DISCOUNT_COUPON;

  const realCondition = unitConversion({
    value: condition,
    divisor: 100,
  });
  const realCouponValue = unitConversion({
    value: couponValue,
    divisor: 100,
  });
  const realValueRandomTo = unitConversion({
    value: valueRandomTo,
    divisor: 100,
  });
  const realDiscount = unitConversion({
    value: discount,
    divisor: 10,
  });

  // 随机券
  if (isRandomCoupon) {
    return `随机减${valueRandomFrom}-${realValueRandomTo}元`;
  }

  // 无门槛
  if (isNoLimit) {
    return isDiscountCoupon ? `${realDiscount}折` : `${realCouponValue}元`;
  }

  if (isDiscountCoupon) {
    return `满${realCondition}打${realDiscount}折`;
  }
  return `满${realCondition}元减${realCouponValue}元`;
}
