import accSub from '@youzan/utils/number/accSub';
import { GOODS_TYPE } from 'constants/course/goods-type';

export function computeDiscountPrice(originPrice = [], activityPrice = [], type) {
  if (originPrice.length === 1 && activityPrice.length === 1) {
    let originPriceValue = 0;
    let activityPriceValue = 0;
    if (type === GOODS_TYPE.COURSE) {
      originPriceValue = originPrice[0].price;
      activityPriceValue = activityPrice[0].price;
    } else {
      originPriceValue = originPrice[0];
      activityPriceValue = activityPrice[0];
    }
    return accSub(originPriceValue, activityPriceValue);
  }

  let discountPriceArray = [];
  originPrice.forEach((item, index) => {
    if (type !== GOODS_TYPE.COURSE) {
      discountPriceArray.push(accSub(item, activityPrice[index]));
    } else {
      activityPrice.forEach((aitem) => {
        if (+aitem.id === +item.id) {
          discountPriceArray.push(accSub(item.price, aitem.price));
        }
      });
    }
  });
  discountPriceArray.sort((a, b) => { return b - a; });
  return discountPriceArray[0];
};

export function fromatJoinList(list = []) {
  list.forEach(item => {
    if (item.isHead) {
      item.label = '开团时间';
      item.tag = '团长';
    } else {
      item.label = '参团时间';
    }
  });
  return list;
};
