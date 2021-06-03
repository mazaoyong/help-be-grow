import { groupBy, isNumber } from 'lodash';
import type { ILiveCouponDTO } from 'definitions/api/owl/api/LiveCouponFacade/findCouponList';
import format from '@youzan/utils/money/format';
interface ILegalCoupon {
  id: number;
  name: string;
  value: string;
  unit?: string;
  threshold?: string;
  /** 优惠券名称下面的描述信息 */
  validTime?: string;
  isReceived: boolean;
  btnText: string;
}

function formatCoupon(couponData: ILiveCouponDTO): ILegalCoupon {
  let discountValue = couponData.valueCopywriting;
  if (isNumber(discountValue)) {
    // 如果是数字类型，用金额格式化函数进行格式化
    discountValue = format(Number(discountValue), false, false);
  }
  return {
    id: couponData.couponId,
    value: discountValue,
    name: couponData.title,
    unit: couponData.unitCopywriting, // 可能不需要展示单位
    threshold: couponData.preferentialCopywriting,
    validTime: getDayRange(couponData.validTimeCopywriting),
    isReceived: couponData.isReceived,
    btnText: couponData.isReceived ? '已领取' : '立即领取',
  };
}

export default formatCoupon;
// 优化优惠券排列顺序，没有领取的优惠券排在前面
export const serialCouponList = (couponList: ILiveCouponDTO[]): ILiveCouponDTO[] => {
  const hasReceivedCoupon = couponList.some(coupon => coupon.isReceived);
  if (hasReceivedCoupon) {
    const {
      false: unreceivedCouponList,
      true: receivedCouponList,
    } = groupBy(couponList, 'isReceived');
    return (unreceivedCouponList || []).concat(receivedCouponList);
  }
  return couponList;
};

function getDayRange(timeRange: string) {
  if (!timeRange) return '';
  /** test if time range is a legally time type */
  const timeType = /(\d{4}\.\d{1,2}\.\d{1,2})(\d{1,2}:\d{1,2}(:\d{1,2})?)?/;
  const isLegallyTime = timeType.test(timeRange);
  /** match xxxx.xx.xx */
  const matcher = /(\d{4}\.\d{1,2}\.\d{1,2})/g;
  const dayRange = timeRange.match(matcher);
  if (dayRange) {
    return dayRange.join('-');
  }
  // 如果不是合法的时间范围，那就是时间的描述，比如'领取后xx天可用'
  return isLegallyTime ? '' : timeRange;
}
