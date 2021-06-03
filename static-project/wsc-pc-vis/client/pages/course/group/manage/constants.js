import { get } from 'lodash';

// 普通分组类型
export const NORMAL_GROUP_TYPE = 0;

// 系统默认分组
export const DEFAULT_GROUP = {
  others: {
    type: 1,
    title: '*其他分组',
    url: '',
    description: '',
  },
  newest: {
    type: 2,
    title: '*最新上架',
    url: '',
    description: '分组中所有课程，新发布的课程排在前面',
  },
  hot: {
    type: 3,
    title: '*人气课程',
    url: '',
    description: '分组中所有课程，系统根据商品被浏览、购买情况对课程排序',
  },
  hidden: {
    type: 4,
    title: '*店铺中隐藏',
    url: '',
    description: '分组中的课程，不在店铺中显示，也无法搜索到，只能通过链接访问',
  },
};

// 媒体类型
export const MEDIA_TYPE = {
  TEXT: 1, // 图文
  AUDIO: 2, // 音频
  VIDEO: 3, // 视频
};

// 出售状态
export const SELL_STATUS = {
  SELLING: 0, // 出售中
  SELLEDOUT: 1, // 已出售
  SELLEDSTOP: -1, // 已停售
};

// 课程类型
export const COURSE_TYPE = {
  COLUMN: 1, // 专栏
  CONTENT: 2, // 内容
  LIVE: 4, // 直播
  COURSE: 10, // 线下课
};

// 最多分组数量
export const MAX_GROUP_COUNT = +get(_global, 'courseGroupSetting.maxSize', 50000);

// 单个分组最多含有的课程商品
export const MAX_GROUP_COURSE_COUNT = 100;
