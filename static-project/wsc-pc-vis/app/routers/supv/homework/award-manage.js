// 奖励管理
module.exports = [
  [
    // 作业奖励管理 - 获取作业奖励规则
    'GET',
    '/v4/vis/supv/homework/award-manage/getExerciseReward.json',
    'supv.homework.WorkbookManageController',
    'getExerciseReward',
  ],
  [
    // 作业奖励管理 - 修改作业奖励规则
    'POST',
    '/v4/vis/supv/homework/award-manage/saveExerciseReward.json',
    'supv.homework.WorkbookManageController',
    'saveExerciseReward',
  ],
];
