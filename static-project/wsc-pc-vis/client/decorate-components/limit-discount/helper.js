import { DEFAULT_GOODS_IMAGE } from '../common/constants';
import { repeat } from '../common/utils';

function getGoodsByNum(defaultImageUrl, num) {
  return repeat(
    {
      image_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      title: '此处显示商品名称',
      discount_type: 3,
      discount_value: 2000,
      discount_price: '59.99',
      stock_num: 10,
      total_sold_num: 15,
      price: '79.99',
      start_at: 0,
      end_at: 0,
    },
    num
  );
}

export function getGoodsPlaceHolder(defaultImageUrl, size) {
  if (size === 0 || size === 2 || size === 3) {
    return getGoodsByNum(defaultImageUrl, 3);
  } else if (size === 1 || size === 6) {
    return getGoodsByNum(defaultImageUrl, 4);
  } else if (size === 5) {
    return getGoodsByNum(defaultImageUrl, 6);
  }
}
