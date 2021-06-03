module.exports = [
  [
    '微商城连锁-网店-上门自提',
    'GET',
    '/v4/trade/branch/delivery/setting/self-fetch(.*)',
    'delivery-setting.SelfFetchController',
    'getSelfFetchHtml',
  ],
];
