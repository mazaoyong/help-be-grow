import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../index';

export default function(params) {
  const { activityData } = store.state;
  params.umpInfo.promotionType = ACTIVITY_TYPE.SEC_KILL;
  params.umpInfo.promotionId = activityData.activityId;
  params.umpInfo.promotionAlias = activityData.activityAlias;
}
