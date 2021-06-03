import { get } from 'lodash';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';
import formatMoney from '@/pages/course/detail/utils/formatMoney';

export default function(data, state) {
  const startTime = data.startAt * 1000;
  const endTime = data.endAt * 1000;

  let status = ACTIVITY_STATUS.UNSTART;
  if (Date.now() > startTime) {
    status = ACTIVITY_STATUS.GOING;
  }
  if (Date.now() > endTime) {
    status = ACTIVITY_STATUS.END;
  }

  const map = get(data, 'skus', []).reduce((obj, item) => {
    obj[item.id] = {
      price: item.discountPrice,
    };
    return obj;
  }, {});

  const activityData = {
    // 活动通用属性
    hasUmpBlock: true,

    status,

    priceTag: data.description || '限时折扣',

    sku: {
      minPrice: data.min,

      maxPrice: data.max,

      map,
    },

    startTime,

    endTime,

    activityId: get(data, 'activityId', 0),

    quota: +get(data, 'quota', 0),

    quotaUsed: +get(data, 'quotaUsed', 0),

    isAllowContinueBuy: +get(data, 'isAllowContinueBuy', 0),
  };

  const shareInfo = {
    title: `${get(state, 'goodsData.title', '')}限时最低${formatMoney(data.min)}元`,
  };

  return {
    shareInfo,
    activityData,
    ...buttonsRule(activityData, state),
  };
}
