import unitConversion from 'fns/number';
import {
  CouponTypeEnum,
  PreferentialTypeEnum,
  IRewardItem
} from 'definitions/api/owl/pc/CommonActivityPCFacade/getRewardByPage';

export function getUuid() {
  return Date.now() + Math.ceil(Math.random() * 1000);
}

/**
 *
 1张无门槛减3元优惠券，则展示“3元券 x1“
 1张无门槛打9折优惠券，则展示“9折券 x1”
 1张满90减20元优惠券，则展示“满90元减20元券 x1”
 1张满100打9折优惠券，则展示“满100打9折券 x1”
 1张商品兑换券，则展示“兑换指定商品券 x1”
 1张随机券，则展示“随机减X-Y元券 x1
 1张优惠码，则展示“「优惠券条件」优惠码 x1”
 */
export function getCouponName(item: IRewardItem) {
  const { type, condition, couponValue, valueRandomTo, discount, preferentialType } = item;

  if (type === CouponTypeEnum.EXCHANGE_CARD) {
    return '兑换指定商品';
  }

  const isNoLimit = !condition;
  const isRandomCoupon = !!valueRandomTo;
  const isDiscountCoupon = preferentialType === PreferentialTypeEnum.DISCOUNT_COUPON;

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
    return `随机减${realCouponValue}-${realValueRandomTo}元`;
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

export function getSuffixCouponName(type?: CouponTypeEnum) {
  switch (type) {
    case CouponTypeEnum.UNIQUE_CODE:
    case CouponTypeEnum.SHARED_CODE:
      return '优惠码';
    default:
      return '券';
  }
}
