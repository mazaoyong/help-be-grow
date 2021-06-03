import fullfillImage from '@youzan/utils/fullfillImage';
import UA from 'zan-utils/browser/ua_browser';

// 高度占比
const hRatio = 330 / 667;

// 宽高占比
const whRatio = 240 / 330;

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
  bg: fullfillImage('https://img01.yzcdn.cn/public_files/3746afb002c3cf9e51dca687fb36a304.png', 'origin'),
  isStart: false,
  isLoaded: false,
  type: 'custom',
};

export const POSTER_DEFAULT_BG = [
  {
    bg: fullfillImage('https://img01.yzcdn.cn/public_files/0f5767d7d82a7cba01b6dc528093b58c.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'default',
    theme: 'blue',
    posterStyle: 1,
  },
  {
    bg: fullfillImage('https://img01.yzcdn.cn/public_files/270ecd5f728e3b53f65821482f2c68f9.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'default',
    theme: 'orange',
    posterStyle: 2,
  },
  {
    bg: fullfillImage('https://img01.yzcdn.cn/public_files/b33b2bffdb491f735019b5c88dda9860.png', 'origin'),
    isStart: false,
    isLoaded: false,
    type: 'default',
    theme: 'orange',
    posterStyle: 3,
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

// 分享文案
export const REFEREE_SHARE_TITLE = {
  SHARE: '快来领取奖励，和我一起上课吧！',
  BOOSTING: '快来帮我助力，你也有机会领取奖励！',
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

// 邀请人数显示状态
export const SHOWJOINNUM = {
  NO: 0,
  YES: 1,
};

export const AWARD_NODE = {
  NEW: 0,
  STEP1: 1,
  STEP2: 2,
  STEP3: 3,
  STEP4: 4,
};

export const AWARD_DESC = {
  [AWARD_NODE.STEP1]: '分享活动可得',
  [AWARD_NODE.STEP2]: '好友领取奖励后可得',
  [AWARD_NODE.STEP3]: '好友试听后可得',
  [AWARD_NODE.STEP4]: '好友报名后可得',
};

// 新学员分享图片
export const REFEREE_SHARE_IMG = {
  '1': 'https://img01.yzcdn.cn/public_files/1e45bcc9b561edc26a929d2a3440ed1d.png',
  '2': 'https://img01.yzcdn.cn/public_files/33b7b49a80cb171338fc5ff525278fd1.png',
  '3': 'https://img01.yzcdn.cn/public_files/34af8d3f9f049a7b3bfa717aa167a366.png',
};

// 新老学员H5页面分享图标
export const SHARE_H5_ICON = 'https://img01.yzcdn.cn/public_files/7afb89daa3dd24b2fcdd54e5c6c7335a.png';

export const REWARD_TYPE_ICON = {
  '2': 'https://img01.yzcdn.cn/public_files/8c0e0c5b91fc0a006cf221035e45aebd.png',
  '3': 'https://img01.yzcdn.cn/public_files/6872633273b26303845e3f7a606fe582.png',
  '1': 'https://img01.yzcdn.cn/public_files/b46cd0231949384665221fe5eb5e14f7.png',
};

export const LIST_EMPTY_IMG = 'https://img01.yzcdn.cn/public_files/86b855a33adbe0fe009e403dc9e56257.png';

export const DEFAULT_AVATAR = 'https://img01.yzcdn.cn/public_files/2017/10/23/1321da81aa84d0539b0d5af73fbbf53b.png';

export const DEFAULT_NAME = '小伙伴';

export const REWARD_STATUS_LABEL = {
  '1': '领取奖励',
  '2': '领取奖励',
  '3': '试听',
  '4': '报名',
};

export const NODE_LABEL = {
  '1': '分享',
  '2': '邀请好友',
  '3': '邀请好友',
  '4': '邀请好友',
};
