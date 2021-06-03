module.exports = [
  [
    '获取物流设置',
    'GET',
    '/v4/trade/api/local-delivery/getSetting.json',
    'local-delivery.LocalDeliveryController',
    'getSetting',
  ],
  [
    '更新物流设置',
    'PUT',
    '/v4/trade/api/local-delivery/updateSetting.json',
    'local-delivery.LocalDeliveryController',
    'updateSetting',
  ],
  [
    '进行仿真模拟',
    'GET',
    '/v4/trade/api/local-delivery/querySimulation.json',
    'local-delivery.LocalDeliveryController',
    'querySimulation',
  ],
  [
    '获取同城配送配置',
    'GET',
    '/v4/trade/api/local-delivery/getAllConfig.json',
    'local-delivery.LocalDeliveryController',
    'getAllConfig',
  ],
  [
    '保存同城配送配置',
    'POST',
    '/v4/trade/api/local-delivery/saveAllConfig.json',
    'local-delivery.LocalDeliveryController',
    'saveAllConfig',
  ],
  [
    '保存业务类型（第一次）',
    'POST',
    '/v4/trade/api/local-delivery/createLocalShop.json',
    'local-delivery.LocalDeliveryController',
    'createLocalShop',
  ],
  [
    '保存业务类型（非第一次）',
    'POST',
    '/v4/trade/api/local-delivery/updateShop.json',
    'local-delivery.LocalDeliveryController',
    'updateShop',
  ],
  [
    '获取服务商列表',
    'GET',
    '/v4/trade/api/local-delivery/getLocalPartnersList.json',
    'local-delivery.LocalDeliveryController',
    'getLocalPartnersListJson',
  ],
  [
    '开通服务商',
    'POST',
    '/v4/trade/api/local-delivery/enablePartner.json',
    'local-delivery.LocalDeliveryController',
    'enablePartner',
  ],
  [
    '获取服务商配费说明',
    'GET',
    '/v4/trade/api/local-delivery/getLocalPartnerFeeInfo.json',
    'local-delivery.LocalDeliveryController',
    'getLocalPartnerFeeInfoJson',
  ],
  [
    '开关服务商服务',
    'POST',
    '/v4/trade/api/local-delivery/togglePartners.json',
    'local-delivery.LocalDeliveryController',
    'togglePartnersJson',
  ],
  [
    '同城配送首页',
    'GET',
    ['/v4/trade/na/local-delivery', '/v4/trade/na/local-delivery/index'],
    'na.local-delivery.LocalDeliveryController',
    'getIndexHtml',
  ],
];
