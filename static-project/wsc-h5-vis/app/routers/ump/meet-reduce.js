module.exports = [
  [
    // 领取赠品页面
    'GET',
    ['/wscvis/ump/receive-present', '/wscvis/ump/receive-present/*'],
    'ump.RenderController',
    'getReceivePresentHtml',
  ],
  [
    // 领取赠品列表
    'GET',
    '/wscvis/ump/findPresentByCondition.json',
    'ump.ActivityController',
    'findPresentByCondition',
  ],
  [
    // 获取赠品
    'POST',
    '/wscvis/ump/receivePresent.json',
    'ump.ActivityController',
    'receive',
  ],
  [
    // 获取赠品列表
    'GET',
    '/wscvis/ump/present/list-presents-by-condition.json',
    'ump.ActivityController',
    'listPresentsByCondition',
  ],
  [
    // 获取赠品
    'POST',
    '/wscvis/ump/present/receive-present.json',
    'ump.ActivityController',
    'receivePresent',
  ],
];
