export enum SELLER_TYPE {
  SINGLE = 1, // 单独售卖
  COLUMN = 2, // 专栏售卖
  BOTH = 3 // 可单独售卖也可专栏售卖
};

export const LIVE_TYPE = {
  IMAGE_TEXT: 1,
  POLYV: 4,
  VIDEO: 5,
};

export const POLYV_TYPE = {
  INIT: 'init',
  UPDATE: 'update',
};

/** 直播状态 */
export enum LIVE_STATUS {
  /** 已删除 */
  DELETE = 0,
  /** 未开始 */
  UNSTART = 1,
  /** 直播中 */
  LIVING = 2,
  /** 已结束/回看 */
  END = 3,
  /** 回放中 */
  PLAYBACK = 4,
  /** 回放准备中 */
  PRE_PLAYBACK = 5,
  /** 泛指保利威直播的所有直播状态 */
  POLYV_LIVE = 99,
}
