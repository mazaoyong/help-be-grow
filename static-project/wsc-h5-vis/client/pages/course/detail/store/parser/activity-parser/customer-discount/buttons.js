import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import getDefaultButtonText from '../default-button-text';

export default function(activityData, state) {
  const { sellerType, column } = state.goodsData;

  function customerDiscountPay() {
    pay(ACTIVITY_TYPE.CUSTOMER_DISCOUNT);
  }

  const buttons = [];

  if (sellerType === SELLER_TYPE.COLUMN || sellerType === SELLER_TYPE.BOTH) {
    buttons.push({
      text: '查看专栏',
      url: `/wscvis/course/detail/${column.alias}?kdt_id=${_global.kdtId || ''}`,
    });
  }

  buttons.push({
    text: getDefaultButtonText(state),
    action: customerDiscountPay,
  });

  return {
    buttons,
    skuButtons: [{
      text: '立即报名',
      action: customerDiscountPay,
    }],
  };
}
