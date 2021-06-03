module.exports = [
  ['快速打单页', 'GET', '/v4/trade/quicklist', 'quicklist.IndexController', 'getIndexHtml'],
  [
    '获取打单页推荐应用的接口',
    'GET',
    '/v4/trade/quicklist/get-recommend.json',
    'quicklist.IndexController',
    'getRecommend',
  ],
  [
    '获取打单页广告banner的接口',
    'GET',
    '/v4/trade/quicklist/get-advert.json',
    'quicklist.IndexController',
    'getAdvert',
  ],
];
