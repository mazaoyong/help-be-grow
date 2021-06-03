import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';

export default function(data) {
  const activityData = {
    // 活动通用属性
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    channelType: data.channelType,
  };

  return {
    activityData,
  };
}
