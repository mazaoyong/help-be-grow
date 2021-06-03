import { get } from 'lodash';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

export default function(data, state) {
  const currentCollectZanProduct = get(data, 'currentCollectZanProduct.skuStocks', []);
  const startTime = new Date(data.startAt.replace(/-/ig, '/')).getTime();
  const endTime = new Date(data.endAt.replace(/-/ig, '/')).getTime();

  let status = ACTIVITY_STATUS.UNSTART;
  if (Date.now() > startTime) {
    status = ACTIVITY_STATUS.GOING;
  }
  if (Date.now() > endTime) {
    status = ACTIVITY_STATUS.END;
  }

  const activityData = {
    // 活动通用属性
    hasUmpBlock: false,

    status,

    startTime,

    endTime,

    sku: {
      map: currentCollectZanProduct.reduce((map, sku) => {
        map[sku.skuId] = {
          stockNum: sku.stock,
        };
        return map;
      }, {}),
    },

    id: data.id,

    prizeChannel: data.prizeChannel,

    collectNum: data.collectNum,

    currentCollectZanProduct: get(data, 'currentCollectZanProduct', {}),
  };

  return {
    activityData,
    ...buttonsRule(activityData, state),
  };
}
