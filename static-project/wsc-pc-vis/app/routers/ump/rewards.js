module.exports = [
  ['GET', '/v4/vis/edu/page/rewards', 'ump.RewardsController', 'getIndexHtml'],
  ['GET', '/v4/vis/edu/rewards/getInfo.json', 'ump.RewardsController', 'getRewardRelationInfo'],
  ['POST', '/v4/vis/edu/rewards/createReward.json', 'ump.RewardsController', 'createRewardActivity'],
  ['POST', '/v4/vis/edu/rewards/updateReward.json', 'ump.RewardsController', 'updateRewardActivity'],
  ['GET', '/v4/vis/edu/rewards/getRewardsList.json', 'ump.RewardsController', 'getRewardsList'],
  ['GET', '/v4/vis/edu/rewards/getRecordsList.json', 'ump.RewardsController', 'getRecordsList'],
  ['POST', '/v4/vis/edu/rewards/updateRewardStatus.json', 'ump.RewardsController', 'updateRewardStatus'],
  ['POST', '/v4/vis/edu/rewards/submitExportRewardRecordTask.json', 'ump.RewardsController', 'submitExportRewardRecordTask'],
  ['GET', '/v4/vis/edu/rewards/getCoupons.json', 'ump.RewardsController', 'getCoupons'],
  ['GET', '/v4/vis/edu/rewards/getRewardActivity.json', 'ump.RewardsController', 'getRewardActivity'],
];
