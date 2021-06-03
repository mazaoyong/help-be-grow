import { get } from 'lodash';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

export default function(data, state) {
  const map = get(data, 'simpleSkuInfoList', []).reduce((obj, item) => {
    obj[item.skuId] = {
      price: item.price,
    };
    return obj;
  }, {});

  const activityData = {
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    priceTag: '会员价',

    sku: {
      minPrice: get(data, 'minPrice', 0),

      maxPrice: get(data, 'maxPrice', 0),

      map,
    },
  };

  return {
    activityData,
    ...buttonsRule(activityData, state),
  };
}
