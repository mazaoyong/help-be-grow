import { get } from 'lodash';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

export default function(data, state, activityTypes) {
  const goodsSku = get(data, 'goodsSku', []);

  if (goodsSku.length === 1) {
    goodsSku[0].pointsPrice = get(data, 'pointsPrice', 0);
  }

  const map = {};
  const firstSku = goodsSku[0] || {};
  let maxPoint = {
    points: firstSku.pointsPrice,
    price: firstSku.remainPrice,
  };
  let minPoint = {
    points: firstSku.pointsPrice,
    price: firstSku.remainPrice,
  };

  goodsSku.forEach(item => {
    map[item.skuId] = {
      points: item.pointsPrice,
      price: item.remainPrice,
      stockNum: item.totalNum - item.exchangedNum,
    };
    if (item.pointsPrice > maxPoint.points) {
      maxPoint = {
        points: item.pointsPrice,
        price: item.remainPrice,
      };
    }
    if (item.pointsPrice < minPoint.points) {
      minPoint = {
        points: item.pointsPrice,
        price: item.remainPrice,
      };
    }
  });

  const activityData = {
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    sku: {
      maxPoint,

      minPoint,

      stockNum: get(data, 'totalNum', 0) - get(data, 'exchangedNum', 0),

      map,
    },

    activityId: get(data, 'id', 0),

    quota: get(data, 'quotaNum', 0),

    quotaUsed: get(data, 'quotaUsed', 0),

    buyLimit: get(data, 'buyLimit', 0),
  };

  return {
    activityData,
    ...buttonsRule(activityData, state, activityTypes),
  };
}
