module.exports = [
  [
    '微商城连锁-总部-配送设置-各个网店配置',
    'GET',
    '/v4/trade/hq/delivery/setting(.*)',
    'delivery-setting.SettingController',
    'getSettingHtml',
  ],
];
