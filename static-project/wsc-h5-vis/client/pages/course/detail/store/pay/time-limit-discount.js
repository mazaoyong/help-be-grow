import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../index';

export default function(params) {
  const { activityData } = store.state;
  params.umpInfo.promotionType = ACTIVITY_TYPE.TIME_LIMIT_DISCOUNT;
  params.umpInfo.promotionId = activityData.activityId;
}
