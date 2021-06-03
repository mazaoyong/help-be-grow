import { Notify } from 'zent';
import { DEFAULT_GOODS_IMAGE } from '../common/constants';
import { repeat } from '../common/utils';

export function validGoods(originGoods, goods, num) {
  const filterGoods = goods.filter(item => {
    return originGoods.every(originItem => {
      return item.id !== originItem.id;
    });
  });
  const mergeGoods = originGoods.concat(filterGoods);
  let goodsFinal;
  if (num > 0 && mergeGoods.length > num) {
    goodsFinal = mergeGoods.slice(0, num);
    Notify.error('你添加的商品数量超过最大值，已经自动删除多余的商品。');
  } else {
    goodsFinal = mergeGoods;
  }
  return goodsFinal;
}

export function getAllGoods(defaultImageUrl) {
  return repeat(
    {
      goods_info: {
        total_stock: 1,
        attachment_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      },
      title: '此处显示商品名称',
      description: '我是描述',
      skus: [
        {
          description: 'sku规格信息',
          price: 5999,
        },
      ],
    },
    4
  );
}

export function getSimpleGoods(defaultImageUrl) {
  return [
    {
      goods_info: {
        total_stock: 1,
        attachment_url: defaultImageUrl || DEFAULT_GOODS_IMAGE,
      },
      title: '此处显示商品名称',
      description: '我是描述',
      skus: [
        {
          description: 'sku规格信息',
          price: 5999,
        },
      ],
    },
  ];
}
