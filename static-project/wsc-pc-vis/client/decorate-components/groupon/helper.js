import { DEFAULT_GOODS_IMAGE } from '../common/constants';
import { repeat } from '../common/utils';

export function getAllGoods(defaultImageUrl) {
  return repeat(
    {
      condition_num: 2,
      goods_info: {},
      thumb_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称，最多显示两行',
      sku_prices: { 0: 5999 },
      origin_sku_price: { 0: 7999 },
      group_nums: 5,
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
      title: '此处显示商品名称，最多显示两行',
      sku_prices: { 0: 5999 },
      origin_sku_price: { 0: 7999 },
      group_nums: 5,
    },
  ];
}

export function getGoods(defaultImageUrl, repeatNum = 4) {
  return repeat(
    {
      id: Math.random() * 1000,
      imageUrl: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称，最多显示两行',
      subTitle: '此处显示商品描述，最多显示一行',
      sku_prices: { 0: 5999 },
      originSkuPrice: { 0: 7999 },
      conditionNum: 2,
      group_nums: 5,
    },
    repeatNum
  );
}
