module.exports = [
  [
    '微商城连锁-总部-配送设置-首页',
    'GET',
    ['/v4/trade/hq/delivery', '/v4/trade/hq/delivery/template(.*)'],
    'delivery-setting.IndexController',
    'getIndexHtml',
  ],
  [
    '微商城连锁-总部-配送设置-网店配置-列表',
    'GET',
    '/v4/trade/api/delivery/setting/fetch-store-delivery-list',
    'delivery-setting.IndexController',
    'fetchStoreDeliveryList',
  ],
];
