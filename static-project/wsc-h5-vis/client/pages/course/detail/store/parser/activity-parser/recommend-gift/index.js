import { get } from 'lodash';
import args from '@youzan/utils/url/args';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

export default function(data, state) {
  let sku = null;
  let priceTag = '';
  const { goodsData } = state;
  const activity = get(data, '[0]', {});
  const bid = args.get('bid');
  const fid = args.get('fid');

  if (bid) {
    if (activity.isCourseUmp) {
      if (get(activity, 'meetReferee', false)) {
        const priceMap = get(activity, 'recommendPoliteCourse.newerSubsidyPriceMap', {});
        sku = {
          maxPrice: get(activity, 'recommendPoliteCourse.maxNewerPrice', 0),
          minPrice: get(activity, 'recommendPoliteCourse.minNewerPrice', 0),
          map: Object.keys(priceMap).reduce((obj, key) => {
            obj[key] = {
              price: priceMap[key],
            };
            return obj;
          }, {}),
        };
      }
    } else {
      if (get(activity, 'meetReferee', false)) {
        sku = {
          maxPrice: goodsData.sku.maxPrice - activity.newerSubsidyPrice,
          minPrice: Math.max(goodsData.sku.minPrice - activity.newerSubsidyPrice, 0),
        };
      }
    }
    // 仅在包含佣金奖励时显示tag
    if (activity.newerSubsidyPrice) {
      priceTag = '好友推荐专享';
    }
  }

  const activityData = {
    // 活动通用属性
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    priceTag,

    sku,

    recommendGift: activity,

    bid,

    fid,
  };

  return {
    activityData,
    ...buttonsRule(activityData, state, bid),
  };
}
