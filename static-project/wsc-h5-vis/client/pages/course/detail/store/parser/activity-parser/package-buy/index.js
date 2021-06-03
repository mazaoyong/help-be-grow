import { get } from 'lodash';
import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import { PACKAGE_BUY_TYPE } from '@/constants/ump/package-buy-type';

export default function(data, state) {
  const activity = get(data, 'activity', {});
  const goodsList = get(data, 'goodsList', []);

  const startTime = activity.startAt * 1000;
  const endTime = activity.endAt * 1000;

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

    packageType: get(activity, 'type', PACKAGE_BUY_TYPE.FIXED),

    decrease: get(data, 'decrease', 0),

    totalNum: get(data, 'totalNum', 1),

    goodsList,
  };

  return {
    activityData,
  };
}
