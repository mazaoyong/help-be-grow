import { LIVE_TYPE } from '@/constants/course/live-type';
import { LIVE_STATUS } from '@/constants/course/live-status';

/**
 * 获取直播状态文案
 *
 * @param {number} liveStatus - 直播状态
 * @param {number} liveType - 直播类型
 * @return {string|undefined}
 */
export const getLiveStatusDesc = (liveStatus, liveType) => {
  // 有赞教育直播状态3是已结束
  if (liveStatus === LIVE_STATUS.REWATCH && liveType === LIVE_TYPE.YZ_EDU_LIVE) {
    return '已结束';
  }

  return {
    [LIVE_STATUS.UNSTART]: '未开始',
    [LIVE_STATUS.LIVING]: '直播中',
    [LIVE_STATUS.REWATCH]: '回看',
    [LIVE_STATUS.PLAYBACK]: '回放中',
    [LIVE_STATUS.PRE_PLAYBACK]: '回放准备中',
  }[liveStatus];
};
