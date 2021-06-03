import { ISwitchProps } from 'zent/es/switch';

export enum ENUM_SWITCH_FUNC {
  /** 订阅数 */
  SUBS = 1,
  /** 更新数 */
  UPD = 2,
  /** 播放数 */
  PLAY = 9,
}

// 开关状态
export enum ENUM_SWITCH_STATUS {
  /** 未设置 */
  INIT = 0,
  /** 所有可见 */
  OPEN = 1,
  /** 所有不可见 */
  CLOSE = 2,
}

// 店铺能力编码枚举
export enum SHOP_ABILTY_CODE {
  /** 可用 */
  USABLE = 1,
  /** 不可用 */
  UNUSABLE = 2,
  /** 未关联 */
  NONE = 3,
}

export interface VisibilityResult {
  switchFun: ENUM_SWITCH_FUNC;
  switchStatus: ENUM_SWITCH_STATUS;
}

export interface HideSwitchItem {
  switchFun: ENUM_SWITCH_FUNC;
  title: string;
  renderDesc: (checked: boolean) => React.ReactNode;
  switchProps?: (checked: boolean) => Partial<ISwitchProps>;
  isHide?: boolean;
}

export interface HideItem {
  switchStatus: ENUM_SWITCH_STATUS;
  loading: boolean;
}
