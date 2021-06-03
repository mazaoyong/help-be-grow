import format from '@youzan/utils/money/format';
import commonFormatCoupon from '@/common/utils/format-coupon';
import formatMoney from '@/pages/course/detail/utils/formatMoney';
import { COUPON_STATUS } from '@/constants/course/coupon-status';

interface IScore {
  score: number;
  name: string;
  unit: string;
}

interface IGood {
  presentPrice: number;
  presentSkuDesc: string;
  [x: string]: any;
}

interface IPresentCoupon {
  couponId: number;
  couponValue: number;
  couponUnitDesc: string;
  couponTitle: string;
  couponNum: number;
  couponValueRandomFrom: number;
  couponValueRandomTo: number;
  couponDiscount: number;
  couponCondition?: number;
}

export function formatCoupon(coupon: any) {
  const {
    id,
    useThresholdCopywriting,
    // hasToken,
    status = COUPON_STATUS.UNRECEIVED,
    ...rest
  } = coupon;

  const isReceived = status === COUPON_STATUS.RECEIVED;

  const commonCoupon = commonFormatCoupon({
    ...rest,
    couponId: id,
    isReceived,
    preferentialCopywriting: useThresholdCopywriting,
  });

  Object.assign(commonCoupon, {
    couponStatus: status,
  });

  return commonCoupon;
}

export function formatScoreToCoupon({ score, name, unit }: IScore) {
  return {
    id: 'coupon_score',
    value: score,
    unit, // 积分、金币
    name,
    sectionTitle: `送${unit}`,
  };
}

export function formatGood({ presentPrice, presentSkuDesc, ...other }: IGood) {
  return {
    desc: presentSkuDesc,
    price: format(presentPrice),
    ...other,
  };
}

export function formatPresentCoupon(coupon: IPresentCoupon, title: string) {
  const {
    couponId,
    couponValue,
    couponUnitDesc,
    couponNum,
    couponValueRandomFrom = 0,
    couponValueRandomTo = 0,
    couponDiscount,
    couponCondition,
  } = coupon;
  const threshold = couponCondition
    ? `满${formatMoney(couponCondition)}元使用`
    : '无使用门槛';

  let data = {
    id: couponId,
    value: format(couponValue),
    unit: couponUnitDesc,
    name: title,
    num: couponNum,
    threshold,
    sectionTitle: `送优惠券`,
  };
  // 随机券
  if (couponValueRandomFrom || couponValueRandomTo) {
    const [from, to] = [couponValueRandomFrom, couponValueRandomTo].map((d) =>
      formatMoney(d),
    );
    Object.assign(data, {
      value: `${from}-${to}`,
    });
    return data;
  }
  if (couponUnitDesc === '折') {
    const discountValue = formatMoney(+couponDiscount * 10);
    Object.assign(data, {
      value: discountValue,
    });
  }
  return data;
}
