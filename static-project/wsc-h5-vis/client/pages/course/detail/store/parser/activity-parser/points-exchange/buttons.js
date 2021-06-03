import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import { navigateEnv } from '@/common/utils/env';
import pay from '@/pages/course/detail/store/pay';
import getDefaultButtonText from '../default-button-text';

export default function(activityData, state, activityTypes) {
  const { quota, quotaUsed, buyLimit } = activityData;
  const defaultButtonText = getDefaultButtonText(state);

  function normalPay() {
    // 可以使用会员价购买
    if (activityTypes.includes(ACTIVITY_TYPE.CUSTOMER_DISCOUNT)) {
      pay(ACTIVITY_TYPE.CUSTOMER_DISCOUNT, null, 'points-exchange-origin');
    } else {
      pay(ACTIVITY_TYPE.NO_ACTIVITY, null, 'points-exchange-origin');
    }
  }

  function exchange() {
    pay(ACTIVITY_TYPE.POINTS_EXCHANGE, null, 'points-exchange');
  }

  const exchangeButton = {
    text: `${state.shopConfig.pointsName}兑换`,
    action: exchange,
  };

  // 活动限购
  if (quota > 0 && quotaUsed >= quota) {
    const message = `限兑${quota}件，你已兑换（${quotaUsed}）件`;
    if (buyLimit) {
      return {
        buttons: [{
          text: '查看其他课程',
          action: navigateEnv,
        }],
        message,
      };
    }
    return {
      buttons: [{
        text: defaultButtonText,
        action: normalPay,
      }],
      message,
    };
  }

  if (buyLimit) {
    return {
      buttons: [exchangeButton],
      skuButtons: [exchangeButton],
    };
  }

  return {
    buttons: [exchangeButton, {
      text: defaultButtonText,
      action: normalPay,
    }],
    skuButtons: [exchangeButton],
  };
}
