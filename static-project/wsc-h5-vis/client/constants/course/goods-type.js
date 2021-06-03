import { OWL_TYPE } from './owl-type';

/** 教育商品类型 */
export const GOODS_TYPE = {
  /** 专栏 */
  COLUMN: 1,
  /** 分销专栏 */
  FX_COLUMN: 2,
  /** 内容 */
  CONTENT: 3,
  /** 分销内容 */
  FX_CONTENT: 4,
  /** 直播 */
  LIVE: 5,
  /** 课程 */
  COURSE: 6,
};

export const GOODS_TYPE_TO_OWL_TYPE = {
  [GOODS_TYPE.COLUMN]: OWL_TYPE.COLUMN,
  [GOODS_TYPE.FX_COLUMN]: OWL_TYPE.COLUMN,
  [GOODS_TYPE.CONTENT]: OWL_TYPE.CONTENT,
  [GOODS_TYPE.FX_CONTENT]: OWL_TYPE.CONTENT,
  [GOODS_TYPE.LIVE]: OWL_TYPE.LIVE,
  [GOODS_TYPE.COURSE]: OWL_TYPE.COURSE,
};

export const GOODS_TYPE_TO_BUY_BUTTON_TEXT = {
  [GOODS_TYPE.COLUMN]: '购买专栏',
  [GOODS_TYPE.FX_COLUMN]: '购买专栏',
  [GOODS_TYPE.CONTENT]: '购买内容',
  [GOODS_TYPE.FX_CONTENT]: '购买内容',
  [GOODS_TYPE.LIVE]: '购买直播',
  [GOODS_TYPE.COURSE]: '立即报名',
};

export const GOODS_TYPE_TO_FREE_BUY_BUTTON_TEXT = {
  [GOODS_TYPE.COLUMN]: '免费领取',
  [GOODS_TYPE.FX_COLUMN]: '免费领取',
  [GOODS_TYPE.CONTENT]: '免费领取',
  [GOODS_TYPE.FX_CONTENT]: '免费领取',
  [GOODS_TYPE.LIVE]: '免费领取',
  [GOODS_TYPE.COURSE]: '免费报名',
};

export const GOODS_TYPE_TO_SPM = {
  [GOODS_TYPE.COLUMN]: 'pcm',
  [GOODS_TYPE.FX_COLUMN]: 'pcm',
  [GOODS_TYPE.CONTENT]: 'pct',
  [GOODS_TYPE.FX_CONTENT]: 'pct',
  [GOODS_TYPE.LIVE]: 'pcl',
  [GOODS_TYPE.COURSE]: 'cg',
};
