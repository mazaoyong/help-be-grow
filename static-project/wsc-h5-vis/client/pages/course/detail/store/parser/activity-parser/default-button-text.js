import { get } from 'lodash';
import { GOODS_TYPE, GOODS_TYPE_TO_BUY_BUTTON_TEXT, GOODS_TYPE_TO_FREE_BUY_BUTTON_TEXT } from '@/constants/course/goods-type';

export default function getDefaultButtonText(state) {
  const { goodsType, goodsData } = state;

  let text = '';

  if (goodsData.sku.maxPrice) {
    text = GOODS_TYPE_TO_BUY_BUTTON_TEXT[goodsType];
  } else {
    text = GOODS_TYPE_TO_FREE_BUY_BUTTON_TEXT[goodsType];
  }

  if (goodsType === GOODS_TYPE.COURSE && get(goodsData, 'buyButton.buyBtnConfig', 0)) {
    text = get(goodsData, 'buyButton.buyBtnLabel', text);
  }

  return text;
}
