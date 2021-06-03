module.exports = [
  [
    // 校验门店是否授权公众号
    'GET',
    '/v4/vis/common/shop/checkAuth.json',
    'common.ShopController',
    'checkAuth',
  ],
  [
    'GET',
    '/v4/vis/common/shop/getPlugStat.json',
    'common.ShopController',
    'getPlugStat'
  ],
  [
    'GET',
    '/v4/vis/common/shop/getWapQrCode.json',
    'common.ShopController',
    'getWapQrCode',
  ],
];
