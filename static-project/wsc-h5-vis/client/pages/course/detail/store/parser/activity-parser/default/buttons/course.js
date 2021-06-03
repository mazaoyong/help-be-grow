import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';

export default function(state, defaultButtonText) {
  if (state.goodsData.sku.maxPrice) {
    return {
      buttons: [{
        text: defaultButtonText,
        action: pay,
      }],
      skuButtons: [{
        text: '立即报名',
        action: pay,
      }],
    };
  }

  function zeroBuy() {
    pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'zero-buy');
  }

  return {
    buttons: [{
      text: defaultButtonText,
      action: zeroBuy,
    }],
    skuButtons: [{
      text: '免费报名',
      action: zeroBuy,
    }],
  };
}
