module.exports = [
  [
    // 排课管理
    'GET',
    '/v4/vis/edu/page/payback',
    'other.PaybackController',
    'getIndexHTML',
  ],
  [
    // 提交申请
    'POST',
    '/v4/vis/edu/payback/cancelQuickSettleService.json',
    'other.PaybackController',
    'cancelQuickSettleService',
  ],
  [
    // 撤销申请
    'POST',
    '/v4/vis/edu/payback/applyQuickSettleService.json',
    'other.PaybackController',
    'applyQuickSettleService',
  ],
  [
    // 查询课程回款服务
    'GET',
    '/v4/vis/edu/payback/listRecordsWithService.json',
    'other.PaybackController',
    'listRecordsWithService',
  ],
  [
    // 服务准入校验
    'GET',
    '/v4/vis/edu/payback/serviceCheck.json',
    'other.PaybackController',
    'serviceCheck',
  ],
  [
    // 有赞教育资质查询
    'GET',
    '/v4/vis/edu/payback/queryUnitedQualStatus.json',
    'other.PaybackController',
    'queryUnitedQualStatus',
  ],
];
