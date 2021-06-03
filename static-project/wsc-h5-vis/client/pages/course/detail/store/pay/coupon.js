// import { SELLER_TYPE } from '@/constants/course/seller-type';
import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../index';

export default function(params, payload, compositionCB) {
  const { activityData } = store.state;
  params.umpInfo.promotionId = activityData.activityId;
  params.umpInfo.promotionType = ACTIVITY_TYPE.COUPON;

  if (payload && payload.config) {
    Object.assign(params, {
      config: payload.config,
    });
  }

  if (compositionCB) {
    compositionCB({
      activityType: ACTIVITY_TYPE.COUPON,
    });
  }
}
