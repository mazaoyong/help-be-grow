import { ACTIVITY_STATUS } from '@/constants/ump/activity-status';
import buttonsRule from './buttons';

export default function(data, state, getters) {
  const activityData = {
    hasUmpBlock: false,

    status: ACTIVITY_STATUS.UNSTART,

    priceTag: '',

    sku: null,

    startTime: 0,

    endTime: 0,
  };

  const { goodsData = {} } = state;

  // 分享信息
  const shareInfo = {
    title: goodsData.title,
    desc: goodsData.summary || '',
    imgUrl: goodsData.pictures[0].url,
  };

  return {
    shareInfo,
    activityData,
    ...buttonsRule(activityData, state, getters),
  };
}
