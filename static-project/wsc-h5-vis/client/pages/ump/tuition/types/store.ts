import { IInstanceInfo, IPaidOrderInfo, ITemplateInfo } from './activity';
import { ICourseItem } from './course';
import { IBoostUser } from './user';

/** 活动状态 */
export interface IState {

  /** 来源 */
  source: string;

  posterUrl: string;

  userInfo: {
    username: string;
    avatar: string;
  },

  shopInfo: {
    name: string;
  }

  appIsReady: boolean ;
  /** 是否有活动实例 */
  hasInstance?: boolean;

  /** 分享过来的实例 ID
   * @description 他人分享页面过来，在 url 中带上 ?fromInstanceId=xxxxxxx
   */
  fromInstanceId?: string;

  /** 助力人 */
  boostFriendsCount: number;

  coursesCount: number;

  /** 是否展示助力进度模块 */
  showProgressBlock: boolean;

  /** 是否展示助力的好友模块
   * @description 当前活动有好友助力的时候才显示这个模块
   */
  isFriendsBlock: boolean;

  /** 是否展示助力弹窗
   * @description 从他人分享的链接访问页面的时候才显示
   */
  isBoostPopupVisible: boolean;

  isPopupConfirmVisible: boolean;

  /** 是否展示课程列表的弹窗
   * @description 控制 UI 展示，响应用户的点击操作
   */
  isCoursesPopupVisible: boolean;

  /** 是否展示助力好友的弹窗
   * @description  控制 UI 展示，响应用户的点击操作
   */
  isPopupFriendsVisible: boolean;

  /** 是否展示弹窗
   * @description  控制 UI 展示，响应用户的点击操作
   */
  isPopupGuideVisible: boolean;

  /** 活动实例信息 */
  instanceInfo: IInstanceInfo;

  /** 活动模版信息 */
  templateInfo: ITemplateInfo;

  isPopupShareVisible: boolean;

  boostFriends: IBoostUser[];
  courses: ICourseItem[];

  /** 当前选择的课程 id - 临时状态
   * @todo action 传参，取消这个临时状态
   */
  tempCourseAlias: string;

  boostInfo: {
    /** 实例维度点赞次数 */
    instanceHelpCount?: number;
    /** 实例维度点赞限制 */
    instanceHelpLimit?: number;
    /** 活动维度点赞次数 */
    activityHelpCount?: number;
    /** 活动维度点赞限制 */
    activityHelpLimit?: number;
    /** 是否已达到该实例点赞限制， instanceHelpCount==instanceHelpLimit，通常不会超过 */
    hasInstanceOutOfLimit?: boolean;
    /** 是否已达到活动点赞限制， 即activityHelpCount==activityHelpLimit，通常不会超过 */
    hasActivityOutOfLimit?: boolean;
    /** 是否已点赞该实例 */
    hasInstanceHelped?: boolean;
    /** 是否已点赞当前活动 */
    hasActivityHelped?: boolean;
    /** 分享来源实例 的用户头像， 主要一个头像，临时塞在这。 */
    fromInstanceAvatar?: string;
  };
}

// ======== getters =======

export interface IActionButton {
  /** 按钮文案 */
  text: string;
  /** 按钮动作（Store Action） */
  action: string;
}

/** 课程卡片组件的 UI 显示配置 */
export interface ICourseItemConfig {
  /** 是否显示降价标签  */
  cutTag:{
    text: string;
    isVisible: boolean;
  };
  /** 课程卡片按钮配置 */
  actionButton: IActionButton;
}

/** 主区块的 ui 展示与交互配置 */
export interface IBlockMainConfig {
  /** 标题 */
  title: string;
  /** 金额 */
  amount: {
    /** 是否可见 */
    isVisible: boolean;
    /** 数字 */
    amount: number;
  };
  /** 主按钮 */
  mainButton: IActionButton & { hasMotion?: boolean; };
  /** 是否显示兑换按钮，action 是固定的，显示兑换课程弹窗 */
  isRedeemButtonVisible: boolean;
  /** 是否显示 goods */
  goods: {
    /** 是否可见 */
    isVisible: boolean;
    /** 商品数据 */
    data?: IPaidOrderInfo;
  };
  /** 是否显示倒计时 */
  countdown: {
    isVisible: boolean;
    time?: number;
    suffix?: string;
  };
  bottomButton: {
    /** 是否可见 */
    isVisible: boolean;
    /** 按钮文案 */
    text?: string;
    /** 按钮动作（Store Action） */
    action?: string;
  };
}

/** 课程弹窗的配置 */
export interface IPopupCoursesConfig {
  isCardVisible: boolean;
  subtitle: string;
  /** 行动按钮 */
  actionButton: IActionButton & { isVisible: boolean };
  miniCardDesc: [string, string];
}

/** 攒学费活动状态 */
export enum ActivityStatus {
  /** 活动未开始 */
  NOT_STARTED,
  /** 活动进行中，还没参加 */
  NOT_JOIN,
  /** 活动进行中，正在集赞 */
  ONGOING,
  /** 活动进行中，已经集齐 */
  FULL,
  /** 活动进行中，已经兑换 */
  REDEEMED,
  /** 活动已结束/已失效 */
  OVER
}

// 埋点的海报信息
export interface ITrackPosterInfo {
  pType: 'preset' | 'custom'; // 是预设海报还是自定义海报
  pId?: string; // 预设海报的id
  pUrl?: string; // 自定义海报的url
}
