import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';

export default function(data, state) {
  const activityData = {
    // 活动通用属性
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.GOING,

    cpsRate: data.cpsRate,

    distributionMoney: data.distributionMoney,

    isDistribution: data.isDistribution,
  };

  return {
    activityData,
  };
}
