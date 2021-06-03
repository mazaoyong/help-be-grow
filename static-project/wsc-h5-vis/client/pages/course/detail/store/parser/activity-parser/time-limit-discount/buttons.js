import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import pay from '@/pages/course/detail/store/pay';
import { navigateEnv } from '@/common/utils/env';
import getDefaultButtonText from '../default-button-text';

export default function(activityData, state) {
  const { status, quota, quotaUsed, isAllowContinueBuy } = activityData;

  function timeLimitDiscountPay() {
    pay(ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT, null, 'timelimit-buy');
  }

  // 限时折扣活动限购
  if (quota > 0 && quotaUsed >= quota && isAllowContinueBuy === 0) {
    return {
      buttons: [{
        text: '查看其他课程',
        action: navigateEnv,
      }],
      message: `你已超过购买次数限制（${quota}）次`,
    };
  }

  if (status === ACTIVITY_STATUS.UNSTART) {
    return {
      buttons: [{
        text: '直接报名',
        action: pay,
      }],
    };
  }

  return {
    buttons: [{
      text: getDefaultButtonText(state),
      action: timeLimitDiscountPay,
    }],
    skuButtons: [{
      text: '立即报名',
      action: timeLimitDiscountPay,
    }],
  };
}
