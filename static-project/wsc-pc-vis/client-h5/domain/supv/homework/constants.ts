export enum SCORE_RULE {
  TEN = 1, // 十分制
  HUNDREDS, // 百分制
}

export enum SCORE_TYPE {
  SCORE = 1, // 分数制
  LEVEL, // 等第制
}

export enum PUBLISH_TYPE {
  NORMAL,
  TIMER,
}

export enum MEDIA_ITEM_TYPE {
  RICHTEXT = 1,
  IMAGE,
  AUDIO,
  VIDEO,
}

export enum WORKBOOK_STATUS {
  PUBLISHED = 1,
  UNPUBLISHED,
  TIMER,
}

export enum REVIEW_STATUS {
  ALL,
  UNREVIEWED,
  REVIEWED,
}

export enum ASSIGNMENT_STATUS {
  UNCOMMITTED = 10,
  UNREVIEWED = 20,
  REVIEWED = 30,
}

export const DEFAULT_AVATAR = 'https://img.yzcdn.cn/public_files/28b450aa7b6ac09a152e3d9a58550d3a.png';
