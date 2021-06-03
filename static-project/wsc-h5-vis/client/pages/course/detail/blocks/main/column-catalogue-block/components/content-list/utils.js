import { LIVE_TYPE } from '@/constants/course/live-type';
import { LIVE_STATUS } from '@/constants/course/live-status';
import formatDate from '@youzan/utils/date/formatDate';
import secondsToColonTime from '@/pages/course/detail/utils/seconds-to-colon-time';
import formatSalesNum from '@/pages/course/detail/utils/format-sales-num';
import { MEDIA_TYPE, MEDIA_TYPE_SUFFIX } from '@/constants/course/media-type';

const LIVE_STATUS_TAG_CONFIG_MAP = {
  [LIVE_STATUS.UNSTART]: ['未开始', '#D4F2EB'],
  [LIVE_STATUS.LIVING]: ['直播中', '#00B389'],
  [LIVE_STATUS.REWATCH]: ['回看', '#00B389'],
  [LIVE_STATUS.PLAYBACK]: ['回放中', '#00B389'],
  [LIVE_STATUS.PRE_PLAYBACK]: ['回放准备中', '#F2F3F5'],
};

// 获取直播 Tag 的文本和颜色
export const getLiveStatusTagConfig = (liveStatus, liveType) => {
  // 有赞教育直播状态3是已结束
  if (liveStatus === LIVE_STATUS.REWATCH && liveType === LIVE_TYPE.YZ_EDU_LIVE) {
    return { text: '已结束', color: '#F2F3F5' };
  }
  const [text, color] = LIVE_STATUS_TAG_CONFIG_MAP[liveStatus] || ['', ''];
  return { text, color };
};

// 获取内容的描述列表
export const getContentDescList = (item, isOwnAsset, contentProgress) => {
  const list = [];

  // 1.1 视频时长（音频时长暂不支持）
  if (
    item.mediaType === MEDIA_TYPE.VIDEO &&
    item.videoContentDTO &&
    item.videoContentDTO.videoDuration
  ) {
    list.push(secondsToColonTime(item.videoContentDTO.videoDuration));
  }
  // 1.2 直播开始时间
  if (item.mediaType === MEDIA_TYPE.LIVE && item.liveStartAt) {
    list.unshift(formatDate(item.liveStartAt, 'YYYY-MM-DD HH:mm:ss'));
  }

  // 2. 销量，由后端返回（后端判断是否返回）
  if (item.pageView) {
    const str = formatSalesNum(item.pageView);
    list.push(`${str}次${MEDIA_TYPE_SUFFIX[item.mediaType]}`);
  }

  // 3. 学习进度
  if (item.mediaType !== MEDIA_TYPE.LIVE && isOwnAsset) {
    const progress = contentProgress[`c-${item.alias}`] || {};
    if (progress.percent) {
      list.push(
        progress.percent === 100 ? '已学完' : `已学 ${progress.percent || 0}%`,
      );
    }
  }

  return list;
};
