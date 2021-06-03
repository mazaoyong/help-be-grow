module.exports = [
  ['GET', '/v4/trade/store/search.json', 'common.CommonController', 'searchStores'],
  ['GET', '/v4/trade/store/isLite.json', 'common.CommonController', 'detectLiteAdmin'],
  [
    'GET',
    '/v4/trade/store/getLiteStoreList.json',
    'common.CommonController',
    'getAllLiteStoreList',
  ],
];
