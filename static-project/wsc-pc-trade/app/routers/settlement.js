module.exports = [
  ['当日结算页面', 'GET', '/v4/trade/settlement', 'settlement.IndexController', 'getIndexHtml'],
  [
    '查询当日结算申请状态',
    'GET',
    '/v4/trade/settlement/queryApplyStatus.json',
    'settlement.IndexController',
    'queryApplyStatus',
  ],
  [
    '申请加入当日结算',
    'POST',
    '/v4/trade/settlement/applyToJoin.json',
    'settlement.IndexController',
    'applyToJoin',
  ],
  ['退出当日结算', 'POST', '/v4/trade/settlement/quit.json', 'settlement.IndexController', 'quit'],
];
