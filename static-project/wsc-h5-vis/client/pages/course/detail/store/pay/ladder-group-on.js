import { ACTIVITY_TYPE } from '@/constants/ump/activity-type';
import store from '../index';

export default function(params, payload) {
  const { activityData, selectedGrouponLadder } = store.state;
  params.umpInfo.promotionType = ACTIVITY_TYPE.LADDER_GROUPON;
  params.umpInfo.promotionId = activityData.activityId;
  if (payload && payload.groupAlias) {
    params.umpInfo.groupAlias = payload.groupAlias;
  } else {
    params.umpInfo.ladderNum = selectedGrouponLadder;
  }
}
