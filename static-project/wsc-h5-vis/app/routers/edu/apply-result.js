/**
 * 报名结果页相关接口
 */
module.exports = [
  [
    // 我的课程表
    'GET',
    '/wscvis/edu/apply-result',
    'edu.RenderController',
    'getApplyResultIndex',
  ],

  // 获取报名数据
  [
    'GET',
    '/wscvis/edu/apply-result/getRegistrationInfoById.json',
    'edu.ApplyResultController',
    'getRegistrationInfoByIdJson',
  ],
];
