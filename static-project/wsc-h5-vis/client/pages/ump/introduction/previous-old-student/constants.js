import fullfillImage from '@youzan/utils/fullfillImage';
import UA from 'zan-utils/browser/ua_browser';

// 高度占比
const hRatio = 414 / 667;

// 宽高占比
const whRatio = 292 / 414;

// 阈值
export const threshold = 50;

// 默认的图片比例
// pc端预览模式宽度给定默认值
const w = UA.isMobile() ? window.innerWidth : 375;
const h = window.innerHeight;

// 缩放比例
export const scale = 370 / 414;
// 自适应实际宽高
export const actualHeight = h * hRatio;
export const actualWidth = actualHeight * whRatio;

export const gutter = (w - actualWidth) / 2;

// 海报背景图

export const POSTER_CUSTOM_BG = {
  bg: fullfillImage('https://img01.yzcdn.cn/public_files/2020/04/02/custom-bg.png', 'origin'),
  isStart: false,
  isLoaded: false,
  type: 'custom',
};

export const POSTER_DEFAULT_BG = [
  {
    bg: fullfillImage('https://img01.yzcdn.cn/upload_files/2020/08/16/FtF3L2H92UsfW9W_yZpgm56DmtZT.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'default',
    theme: 'blue',
  },
  {
    bg: 'https://img01.yzcdn.cn/upload_files/2020/08/16/FuJ9BeTHVgXWmVsrgTlu1ZxEaczk.png',
    isStart: false,
    isLoaded: false,
    type: 'default',
    theme: 'orange',
  },
];

export const POSTER_DEFINITION_BG = {
  bg: '',
  isStart: false,
  isLoaded: false,
  type: 'definition',
};

export const POSTER_SETTING_TYPE = {
  DETAULT: 1,
  DEFINITION: 2,
};

export const POSTER_BG_LIST = [
  {
    bg: fullfillImage('https://img01.yzcdn.cn/public_files/2020/04/02/custom-bg.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'custom',
  },
  {
    bg: fullfillImage('https://img01.yzcdn.cn/public_files/0f130d6a4e3ea5f9d34cc347e2c0edbe.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'default',
  },
  {
    bg: fullfillImage('https://img01.yzcdn.cn/public_files/6ba041509c8427b5ba3e7682c62cd4f5.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'default',
  },
];

// 活动页背景图片
export const ACTIVITY_BG = {
  coupon: fullfillImage('https://img01.yzcdn.cn/public_files/85c521b691bbf9fe739101057729a511.png', 'origin'),
  cardTop: fullfillImage('https://img01.yzcdn.cn/public_files/81a71e27774e0a5a3006ab3ca6337b95.png', 'origin'),
  cardBottom: fullfillImage('https://img01.yzcdn.cn/public_files/6b3f3eeceac2694137f2b00b24fbb132.png', 'origin'),
  couponTop: fullfillImage('https://img01.yzcdn.cn/public_files/fb2fba7970d30b803bf8c194635ab7f3.png', 'origin'),
  couponBottom: fullfillImage('https://img01.yzcdn.cn/public_files/c52ecf1a05178ef9dd841224c77f3bf7.png', 'origin'),
};

// 邀请记录页背景图
export const RECORD_BG = fullfillImage('https://img01.yzcdn.cn/public_files/ffca725455cc995022fd8b31d50c0b5e.png', 'origin');

// 新学员活动页校区介绍背景图
export const MIDDLE_BG = fullfillImage('https://img01.yzcdn.cn/upload_files/2020/04/27/FlzN6_guvIHcV8MAgSQepOv0rYqh.png', 'middle');

// 分享文案
export const REFEREE_SHARE_TITLE = {
  SHARE: '快来领取奖励，和我一起上课吧！',
  BOOSTING: '快来帮我补充能量，你也有机会领取奖励！',
};

// 新学员参加门槛
export const REWARD_TYPE = {
  NO_THRESHOLD: 1,
  SHARE: 2,
  BOOST: 3,
};

// 奖励领取状态
export const GET_REWARD_STATUS = {
  UN_GET: 0,
  HAS_GOT: 1,
};

// 助力活动状态
export const BOOST_STATUS = {
  NO_BOOST: 0,
  BOOSTING: 1,
  BOOSTED: 2,
};

// 转介绍活动状态
export const ACTIVITY_STATUS = {
  NOT_START: 0,
  STARTED: 1,
  END: 2,
  INVALID: 3,
};

// 邀请记录线索状态
export const RECORDS_STATUS = {
  TO_BE_FOLLOW_UP: 1, // 待跟进
  FOLLOW_UP: 2, // 跟进中
  AUDITIONED: 3, // 已试听
  COMPLETED: 4, // 已报课
};
// 邀请人数显示状态
export const SHOWJOINNUM = {
  NO: 0,
  YES: 1,
};

export const ACTIVITY_STYLE_ENUM = {
  DEFAULT: 1,
  DYNAMIC: 2,
  SCENE: 3,
};

export const ACTIVITY_STYLE = {
  [ACTIVITY_STYLE_ENUM.DEFAULT]: {
    BG: '',
    COLOR: '',
  },
  [ACTIVITY_STYLE_ENUM.DYNAMIC]: {
    BG: '',
    COLOR: '',
  },
  [ACTIVITY_STYLE_ENUM.SCENE]: {
    BG: '',
    COLOR: '',
  },
};

export const AWARD_NODE = {
  NEW: 0,
  STEP1: 1,
  STEP2: 2,
  STEP3: 3,
  STEP4: 4,
};

export const AWARD_TAG = {
  [AWARD_NODE.NEW]: '',
  [AWARD_NODE.STEP1]: '分享活动',
  [AWARD_NODE.STEP2]: '好友领取奖励',
  [AWARD_NODE.STEP3]: '好友到店体验课程',
  [AWARD_NODE.STEP4]: '好友报名课程',
};

export const AWARD_ICON = {
  [AWARD_NODE.NEW]: 'https://img01.yzcdn.cn/upload_files/2020/08/05/FuzR3RX05yw0lpfO6rDkDYfVzaqf.png',
  [AWARD_NODE.STEP1]: 'https://img01.yzcdn.cn/upload_files/2020/08/05/FpVVLQPaTfaLfVvBXdRrOwxwxLer.png',
  [AWARD_NODE.STEP2]: 'https://img01.yzcdn.cn/upload_files/2020/08/05/Fs1Y26zUXm0yuiFrLtjUKwpWdu0U.png',
  [AWARD_NODE.STEP3]: 'https://img01.yzcdn.cn/upload_files/2020/08/05/FunhKhuVpIHQ2iI9HNLImk5S1dUJ.png',
  [AWARD_NODE.STEP4]: 'https://img01.yzcdn.cn/upload_files/2020/08/05/FvaOf3kRoy-8SY0dXg7Rk23w5Pd1.png',
};

export const AWARD_DESC = {
  [AWARD_NODE.STEP1]: '转发活动至好友或者朋友圈，你即可获得',
  [AWARD_NODE.STEP2]: '好友成功领取奖励，你即可获得',
  [AWARD_NODE.STEP3]: '好友领取课程后到店体验，你即可获得',
  [AWARD_NODE.STEP4]: '好友成为正式学员后，你即可获得',
};

export const PAGE_STYLE_TITLE_NEW = {
  1: 'https://img01.yzcdn.cn/upload_files/2020/08/17/FkWPbKN8VKNSF1kKRKGAEHVSsbVx.png',
  2: 'https://img01.yzcdn.cn/upload_files/2020/08/17/FlYnsAY-HckYjlNz4S-1HRNK0eyd.png',
  3: 'https://img01.yzcdn.cn/upload_files/2020/08/17/Fs65jsVv7RPEUoUshFYuoZYe6emX.png',
};

export const PAGE_STYLE_TITLE_OLD = {
  1: 'https://img01.yzcdn.cn/upload_files/2020/08/12/Fr3Xf1u_WAGA7esKHM2bL9hT_3L2.png',
  2: 'https://img01.yzcdn.cn/upload_files/2020/08/12/FneTpX5SYwQiu1ikYOaHkuMyYxWB.png',
  3: 'https://img01.yzcdn.cn/upload_files/2020/08/17/FnF6r-IZwKET30IRHSIyzCAdSQNC.png',
};

export const INTRODUCER_RULE = {
  1: '参与转介绍活动的老学员必须是在机构购买过线下课程的学员，无论是购买的体验课还是正式课都可以',
  2: '参与转介绍活动的老学员必须是机构当前在读学员',
};

// 新学员分享图片
export const REFEREE_SHARE_IMG = {
  [ACTIVITY_STYLE_ENUM.DEFAULT]: {
    SHARE: 'https://img01.yzcdn.cn/upload_files/2020/04/16/FlfCteUNnCL17vWaOIr94B9N53fS.png',
    BOOSTING: 'https://img01.yzcdn.cn/upload_files/2020/04/16/Fte8Vtsha4V-04Tu_XjpX3AjOeHg.png',
  },
  [ACTIVITY_STYLE_ENUM.DYNAMIC]: {
    SHARE: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FgXuZo6DueW3cwnhDmI1DMwabwWV.png',
    BOOSTING: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FkERyl3UnZsvjsG7mJP53aGhG8E1.png',
  },
  [ACTIVITY_STYLE_ENUM.SCENE]: {
    SHARE: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FtDvxduMJf0JWEQF0TGL0VgIosP9.png',
    BOOSTING: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FlZEaH572cgT3mpgKj2ht2JJAJSX.png',
  },
};

// 新老学员H5页面分享图标
export const SHARE_H5_ICON = {
  [ACTIVITY_STYLE_ENUM.DEFAULT]: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FvCh2K_J8pHzGM_5KZmAOUgFjH82.png',
  [ACTIVITY_STYLE_ENUM.DYNAMIC]: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FohXjvq1fkR1zo-I0-Z7yljdq8CI.png',
  [ACTIVITY_STYLE_ENUM.SCENE]: 'https://img01.yzcdn.cn/upload_files/2020/08/24/FgqCmJrN7ZbLT_l7y0gjqytFK_ci.png',
};
