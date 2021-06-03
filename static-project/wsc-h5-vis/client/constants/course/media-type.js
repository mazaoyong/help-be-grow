/** 知识付费内容类型 */
export const MEDIA_TYPE = {
  /** 图文内容 */
  IMAGE_TEXT: 1,
  /** 音频内容 */
  AUDIO: 2,
  /** 视频内容 */
  VIDEO: 3,
  /** 直播内容 */
  LIVE: 4,
};

export const MEDIA_TYPE_DESC = {
  [MEDIA_TYPE.IMAGE_TEXT]: '图文',
  [MEDIA_TYPE.AUDIO]: '音频',
  [MEDIA_TYPE.VIDEO]: '视频',
  [MEDIA_TYPE.LIVE]: '直播',
};

export const MEDIA_TYPE_SUFFIX = {
  [MEDIA_TYPE.IMAGE_TEXT]: '学习',
  [MEDIA_TYPE.AUDIO]: '学习',
  [MEDIA_TYPE.VIDEO]: '观看',
  [MEDIA_TYPE.LIVE]: '观看',
};

export const MEDIA_TYPE_FREE_BUTTON = {
  [MEDIA_TYPE.IMAGE_TEXT]: '免费试读',
  [MEDIA_TYPE.AUDIO]: '免费试听',
  [MEDIA_TYPE.VIDEO]: '免费试看',
  [MEDIA_TYPE.LIVE]: '免费试看',
};

export const MEDIA_TYPE_SHARE_PREFIX = {
  [MEDIA_TYPE.IMAGE_TEXT]: '好友请你读',
  [MEDIA_TYPE.AUDIO]: '好友请你听',
  [MEDIA_TYPE.VIDEO]: '好友请你看',
};
