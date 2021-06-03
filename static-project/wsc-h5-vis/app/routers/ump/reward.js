module.exports = [
  // 奖励页面
  [
    'GET',
    '/wscvis/edu/reward/list/*',
    'edu.RenderController',
    'getRewardListIndex',
  ],

  // 奖励记录页面
  [
    'GET',
    '/wscvis/edu/reward/record',
    'edu.RenderController',
    'getRewardRecordIndex',
  ],

  // 获取奖励记录列表
  [
    'GET',
    '/wscvis/edu/reward/listCustomRewardRecord.json',
    'edu.RewardController',
    'listCustomRewardRecord',
  ],

  // 领取奖励
  [
    'POST',
    '/wscvis/edu/reward/redeemReward.json',
    'edu.RewardController',
    'redeemReward',
  ],

  // 查询未领取奖励数
  [
    'GET',
    '/wscvis/edu/reward/getRewardTip.json',
    'edu.RewardController',
    'getRewardTip',
  ],

  // 奖励弹窗
  [
    'GET',
    '/wscvis/edu/reward/getRewardWindow.json',
    'edu.RewardController',
    'getRewardWindow',
  ],

  // 获取课程奖励活动
  [
    'GET',
    '/wscvis/edu/reward/findCourseProductRewardActivity.json',
    'edu.RewardController',
    'findCourseProductRewardActivity',
  ],

  /**
   * 通用领取课程页面
   */
  ['GET', '/wscvis/edu/get-course', 'edu.RenderController', 'getCourseHtml'],

  // 获取课程时间段及关联的门店列表
  [
    'GET',
    '/wscvis/edu/reward/getCourseTimeAddrByAlias.json',
    'edu.CourseController',
    'getCourseTimeAddrByAlias',
  ],
  [
    'GET',
    '/wscvis/edu/reward/getCourseTimeAddr.json',
    'edu.CourseController',
    'getCourseTimeAddr',
  ],
  [
    'GET',
    '/wscvis/edu/reward/getKnowledgeByAlias.json',
    'knowledge.ContentController',
    'getKnowledgeByAlias',
  ],
  [
    'POST',
    '/wscvis/edu/reward/getKnowledgeReward.json',
    'knowledge.ContentController',
    'getKnowledgeReward',
  ],
];
