export const REWARD_TAKEN_STATUS = ['未完成', '未领取', '领取中', '已领取', '已失效'];

export const REWARD_STATUS = ['未开始', '进行中', '已失效', '已结束'];

export const REWARD_USAGE_STATUS = ['-', '未使用', '已使用', '已失效'];

export const AWARD_SAMPLE_PIC = 'https://b.yzcdn.cn/public_files/2019/05/31/rewards.png';

export const COURSE_URL = 'https://h5.youzan.com/wscvis/edu/prod-detail';

export const COURSE_DETAIL = 'https://www.youzan.com/v4/vis/edu/course#/course-manage/';

export const REWARDS_TYPE = ['start', 'processing', 'end'];

export const REWARDS_TYPE_MAP = {
  'processing': 4,
  'start': 2,
  'end': 3
};

export const REWARDS_TYPE_BREADCRUM = {
  'processing': '消课',
  'start': '入学',
  'end': '毕业',
};

export const REWARDS_TYPE_DEFAULT_DATA = {
  'processing': {
    rewardNodeType: 4, // 消课课时数/课程生效天数/距开课时长：4，入学奖励：2，毕业奖励：3
    // 发放节点数值
    rewardNodeValue: 1, // 消课课时数：1，课程生效xx天后发放：2，距开课时间xx天后发放：3
    // 入学，消课，毕业
    conditionType: 8 // 消课课时：8；入学：立刻（4），跟随入学（5）；毕业：立刻（6），跟随毕业（7）
  },
  'start': {
    rewardNodeType: 2,
    rewardNodeValue: 1,
    conditionType: 4
  },
  'end': {
    rewardNodeType: 3,
    rewardNodeValue: 1,
    conditionType: 6,
  },
};

export const ACIVITY_STATUS = ['未开始', '进行中', '已失效', '已结束'];
