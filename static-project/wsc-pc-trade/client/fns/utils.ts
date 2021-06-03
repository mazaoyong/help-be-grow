import formatDate from '@youzan/utils/date/formatDate';
import format from '@youzan/utils/money/format';
import args from '@youzan/utils/url/args';
import { isBeautyShop as IS_BEAUTY_STORE } from '@youzan/utils-shop';
import isArray from 'lodash/isArray';

/**
 * 根据订单号获取订单详情url
 * @param {string} orderNo 订单号
 */
export const getOrderDetailUrl = orderNo => {
  if (IS_BEAUTY_STORE) {
    // 美业店铺
    return `/dashboard#/order/search/order/detail?orderNo=${orderNo}`;
  }
  if (_global.isSuperStore) {
    return `${_global.url.store}/order/order/orderdetail#/?order_no=${orderNo}`;
  }

  return `/v4/trade/order/detail?orderNo=${orderNo}`;
};

/**
 * 获取退款详情url
 * @param {*} orderNo 订单号
 * @param {*} itemId 商品id
 */
export const getRefundDetailUrl = (orderNo, itemId?, refundId?) => {
  let result = `/v4/trade/refund/detail?orderNo=${orderNo}`;

  if (itemId) {
    result = args.add(result, { itemId });
  }
  if (refundId) {
    result = args.add(result, { refundId });
  }
  return result;
};

/**
 * 将毫秒格式化成通用的格式
 * @param {*} ms 毫秒数
 */
export const formatMsTime = (ms: number) => {
  if (ms > 0) {
    return formatDate(ms, 'YYYY-MM-DD HH:mm:ss');
  }

  return '';
};

/**
 * 将分格式化成通用的格式
 * @param {*} ms 毫秒数
 */
export const formatCentMoney = (cent: number) => {
  return format(cent, true, false);
};

/**
 * 将json数组字符串转为数组
 * @param {string} jsonStr json字符串数组
 */

export const formatJsonStrToArr = <T>(jsonStr: T[] | string = []): T[] => {
  try {
    const arr = typeof jsonStr === 'string' ? JSON.parse(jsonStr) : jsonStr;
    return isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};
