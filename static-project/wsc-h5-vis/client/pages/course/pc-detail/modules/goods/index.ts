import { GOODS_TYPE } from '@/constants/course/goodsType';
import { SELLER_TYPE } from '@/constants/course/seller-type';

export function isOnlineCourse(goodsType: GOODS_TYPE) {
  return isColumn(goodsType) || isContent(goodsType) || isLive(goodsType);
}

export function isColumn(goodsType: GOODS_TYPE) {
  return goodsType === GOODS_TYPE.COLUMN || goodsType === GOODS_TYPE.FX_COLUMN;
}

export function isContent(goodsType: GOODS_TYPE) {
  return goodsType === GOODS_TYPE.CONTENT || goodsType === GOODS_TYPE.FX_CONTENT;
}

export function isLive(goodsType: GOODS_TYPE) {
  return goodsType === GOODS_TYPE.LIVE;
}

// 是仅专栏售卖且专栏价格为0元
export function isOnlyFreeColumn(goodsData: any) {
  return goodsData.sellerType === SELLER_TYPE.COLUMN &&
    goodsData.column.price === 0;
}
