import { DEFAULT_GOODS_IMAGE } from '../common/constants';
import { SIZE_TYPE_MAP, LAYOUT_MAP } from './constants';
import { repeat } from '../common/utils';

export function getAllGoods(defaultImageUrl) {
  return repeat(
    {
      condition_num: 2,
      goods_info: {},
      thumb_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称',
      min_price: 5999,
      origin_price: 7999,
      group_nums: 5,
      currentStock: 10,
    },
    4
  );
}

export function getSimpleGoods(defaultImageUrl) {
  return [
    {
      condition_num: 2,
      goods_info: {},
      thumb_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称',
      min_price: 5999,
      origin_price: 7999,
      group_nums: 5,
      currentStock: 1,
    },
  ];
}

export function isPromotion(sizeType) {
  return +sizeType === SIZE_TYPE_MAP.PROMOTION;
}

/**
 * 列表样式和促销样式禁用标题切换
 */
export function isDisabledTitle(layout, sizeType) {
  return +layout === LAYOUT_MAP.LIST || isPromotion(sizeType);
}

/**
 * check value
 * @param value
 * @returns {string}
 */
export function getCheckBoxValue(value) {
  return value ? '显示' : '不显示';
}

/**
 * 是否展示购买按钮
 * @param sizeType
 * @returns {boolean}
 */
export function isShowBuyButton(sizeType) {
  return !isPromotion(sizeType);
}
