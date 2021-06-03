module.exports = [
  [
    'GET',
    ['/v4/trade/dashboard', '/v4/trade/dashboard/index'],
    'dashboard.DashboardController',
    'getIndexHtml',
  ],
  [
    'GET',
    '/v4/trade/dashboard/api/data/get',
    'dashboard.DashboardController',
    'getOrderOverviewData',
  ],
];
