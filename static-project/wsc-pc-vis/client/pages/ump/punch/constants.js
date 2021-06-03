// 打卡状态
export const PUNCH_STATUS = {
  1: '未开始',
  2: '进行中',
  3: '已结束',
};

// 打卡详情选择
export const PUNCH_TASK_OPTIONS = [
  {
    type: 'DateRangeQuickPicker',
    name: 'searchDate',
    label: '任务日期：',
    props: {
      format: 'YYYY-MM-DD',
      valueType: 'string',
      showTime: false,
      preset: [
        {
          text: '今天',
          value: 0,
        },
        {
          text: '近7天',
          value: 7,
        },
      ],
    },
  },
  {
    type: 'Input',
    name: 'searchName',
    label: '任务名称：',
    props: {
      width: '185px',
      placeholder: '请输入',
    },
  },
  {
    type: 'Select',
    name: 'status',
    label: '任务设置状态：',
    props: {
      width: '185px',
    },
    data: [
      {
        value: '0',
        text: '未设置',
      },
      {
        value: '1',
        text: '已设置',
      },
    ],
  },
];

// 推广配置 tab
export const PROMOTE_TABS = [
  {
    title: '二维码推广',
    key: 'qrcode',
  },
  {
    title: '日签配置',
    key: 'sign',
  },
  {
    title: '长图配置',
    key: 'long',
  },
];

// 打卡数据 tab
export const STATISTICS_TABS = [
  {
    title: '学员数据',
    key: 'student',
  },
  {
    title: '每日数据',
    key: 'daily',
  },
];

// 打卡介绍
export const PUNCH_DESCRIPTION = [
  {
    type: 'config',
    value: '打卡详情效果预览',
  },
  {
    type: 'rich_text',
    color: '#f9f9f9',
    fullscreen: 0,
    content: '这里是打卡的详情描述',
  },
];

// 打卡介绍失败
export const PUNCH_DESCRIPTION_ERROR = [
  {
    type: 'config',
    value: '打卡详情效果预览',
  },
  {
    type: 'rich_text',
    color: '#f9f9f9',
    fullscreen: 0,
    content: '打卡详情解析失败',
  },
];

// 打卡任务详情
export const TASK_CONTENT = [
  {
    type: 'config',
    value: '任务详情效果预览',
  },
  {
    type: 'rich_text',
    color: '#f9f9f9',
    fullscreen: 0,
    content: '这里是任务的详情描述',
  },
];

// 打卡详情失败
export const TASK_CONTENT_ERROR = [
  {
    type: 'config',
    value: '任务详情效果预览',
  },
  {
    type: 'rich_text',
    color: '#f9f9f9',
    fullscreen: 0,
    content: '打卡详情解析失败',
  },
];

// 打卡任务要求
export const TASK_CONDITIONS = {
  0: [],
  1: [1],
  2: [2],
  3: [1, 2],
};

// 日签默认背景
export const SIGN_DEFAULT_BG = 'https://img.yzcdn.cn/wsc/paidcontent/punch/default-bg.png';
