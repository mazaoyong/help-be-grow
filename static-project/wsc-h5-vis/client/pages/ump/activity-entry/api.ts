import { ajax } from '@youzan/vis-ui';
import { ActivityType, IActivityInfo } from './types';
export function getOnGoingActivities(activityType: ActivityType):Promise<IActivityInfo[]> {
  return ajax({
    url: `/wscvis/ump/common/listOngoingActivity.json?activityType=${activityType}`,
  });
}
