enum ICouponType {
  CASH = 1,
  DISCOUNT,
  EXCHANGE,
}

interface ICouponInfo {
  preferentialType: ICouponType,
  alias: string;
  couponGroupId: number;
  condition: number;
  discount: number;
  denominations: number;
  formativeContext: string;
  title: string;
  validEndTime: string;
  valueRandomTo: number;
  validStartTime: string;
  wapUrl: string;
  wxaUrl: string;
  maxDiscountAmount: number;
}

/**
 * 获取优惠券文案
 */
export function getCouponText(couponInfo: ICouponInfo): string {
  const convertUnit = (price: number) => {
    if (price >= 1000000) {
      return price / 1000000 + '万';
    }
    return price / 100;
  };

  const {
    preferentialType,
    valueRandomTo = 0,
    condition,
    denominations,
    maxDiscountAmount,
  } = couponInfo;

  // 满减券
  if (preferentialType === ICouponType.CASH && valueRandomTo <= 0) {
    const limitPrefix = condition ? `满<span>${convertUnit(condition)}</span>减<span>` : '';
    return `
      ${limitPrefix}${convertUnit(denominations)}</span>元优惠券
    `;
  }

  // 折扣券
  if (preferentialType === ICouponType.DISCOUNT) {
    let limitText = '';
    let maxText = '';

    if (denominations > 0) {
      limitText = `满${convertUnit(denominations)}元使用`;
    }

    if (maxDiscountAmount) {
      maxText = `最多减${convertUnit(maxDiscountAmount)}元`;
    }

    return `
      <span>折扣</span>折优惠券
      <div>${limitText} ${maxText}</div>
    `;
  }

  // 随机金额券
  if (preferentialType === ICouponType.CASH && valueRandomTo > 0) {
    const limitPrefix = condition ? `满<span>${convertUnit(condition)}` : '';
    if (denominations) {
      return `
        ${limitPrefix}</span>立减<span>${convertUnit(denominations)}</span>-<span>${convertUnit(valueRandomTo)}</span>元
      `;
    }

    return `
      ${limitPrefix}</span>最高减<span>${convertUnit(valueRandomTo)}</span>元
    `;
  }

  if (preferentialType === ICouponType.EXCHANGE) {
    return `
      兑换商品
    `;
  }

  return '';
}
