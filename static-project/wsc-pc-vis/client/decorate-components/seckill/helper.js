import { DEFAULT_GOODS_IMAGE } from '../common/constants';
import { repeat } from '../common/utils';

export function getAllGoods(defaultImageUrl) {
  return repeat(
    {
      thumb_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称',
      current_stock: 20,
      activity_price: 900,
      goods_price: 9900,
      status: 1,
      is_check_right: 0,
      tag: '秒杀',
      subTitle: '此处显示商品描述',
      current: Date.now() / 1000,
      begin_at: Date.now() / 1000,
      end_at: (Date.now() + 1000000) / 1000,
    },
    3
  );
}

export function getSimpleGoods(defaultImageUrl) {
  return [
    {
      thumb_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称',
      current_stock: 20,
      activity_price: 1,
      goods_price: 19900,
      status: 1,
      is_check_right: 0,
      tag: '秒杀',
      subTitle: '此处显示商品描述',
      current: Date.now() / 1000,
      begin_at: Date.now() / 1000,
      end_at: (Date.now() + 1000000) / 1000,
    },
  ];
}
