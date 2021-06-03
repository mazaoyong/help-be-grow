/**
 * 直播场景
 */
export enum Scene {
  /** 三分屏直播 */
  threeScreen = 1,
  /** 普通直播 */
  normal = 2,
}

/**
 * 不可选原因
 */
export enum FilterCode {
  /** 可以选择 */
  notFilter = 0,
  /** 已绑定 */
  bound = 1,
  /** 大班课 */
  bigClass = 2,
}
