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
    '自结算获取授权参数',
    'GET',
    '/v4/trade/api/local-delivery/getAuthorizeParams.json',
    'local-delivery.LocalDeliveryController',
    'getAuthorizeParams',
  ],
  [
    '自结算解除授权',
    'POST',
    '/v4/trade/api/local-delivery/deAuthorize.json',
    'local-delivery.LocalDeliveryController',
    'deAuthorize',
  ],
  [
    '自结算刷新授权结果',
    'POST',
    '/v4/trade/api/local-delivery/refreshAuthorizeResult.json',
    'local-delivery.LocalDeliveryController',
    'refreshAuthorizeResult',
  ],
  [
    '自结算绑定或者解绑门店',
    'POST',
    '/v4/trade/api/local-delivery/saveOrUpdateBandShop.json',
    'local-delivery.LocalDeliveryController',
    'saveOrUpdateBandShop',
  ],
  [
    '同城配送首页',
    'GET',
    ['/v4/trade/local-delivery', '/v4/trade/local-delivery/index'],
    'local-delivery.LocalDeliveryController',
    'getIndexHtml',
  ],
];
