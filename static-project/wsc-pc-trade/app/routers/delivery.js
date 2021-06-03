module.exports = [
  ['GET', '/v4/trade/delivery/goods.json', 'delivery.DeliveryController', 'getGoods'],
  ['GET', '/v4/trade/delivery/caculateFee.json', 'delivery.DeliveryController', 'calculateFee'], // Deprecated
  ['GET', '/v4/trade/delivery/fee.json', 'delivery.DeliveryController', 'calculateFee'],
  ['GET', '/v4/trade/delivery/alphaFee.json', 'delivery.DeliveryController', 'calculateAlphaFee'],
  [
    'GET',
    '/v4/trade/delivery/sameCityCap.json',
    'delivery.DeliveryController',
    'queryShopSameCityMode',
  ],
  [
    'GET',
    '/v4/trade/delivery/expressCap.json',
    'delivery.DeliveryController',
    'queryShopExpressMode',
  ],
  [
    'PUT',
    '/v4/trade/delivery/updateSingleGoodsMultiExpressConfig.json',
    'delivery.DeliveryController',
    'updateSingleGoodsMultiExpressConfig',
  ],
  [
    'POST',
    '/v4/trade/delivery/giftCommunityDelivery.json',
    'delivery.DeliveryController',
    'giftCommunityDelivery',
  ],
  ['GET', '/v4/trade/delivery/address.json', 'delivery.DeliveryController', 'getAvailableAddress'],
  ['GET', '/v4/trade/delivery/express.json', 'delivery.DeliveryController', 'getExpressCompanies'],
  // 上门取件取消呼叫
  ['POST', '/v4/trade/delivery/call/cancel.json', 'delivery.DeliveryController', 'cancelCall'],
  // 重新打印
  ['POST', '/v4/trade/delivery/reprint.json', 'delivery.DeliveryController', 'retryPrint'],

  // 同城送小费
  ['GET', '/v4/trade/delivery/tips.json', 'delivery.DeliveryController', 'getTips'],
  // 同城送重量分段数据
  ['GET', '/v4/trade/delivery/local/weights.json', 'delivery.DeliveryController', 'getAllWeights'],
  // 获取订单取消原因列表
  [
    'GET',
    '/v4/trade/delivery/local/getOrderCancelReasons.json',
    'delivery.DeliveryController',
    'getOrderCancelReasons',
  ],
  // 获取取消订单违约金
  [
    'GET',
    '/v4/trade/delivery/local/getCancelDeductFee.json',
    'delivery.DeliveryController',
    'getCancelDeductFee',
  ],
  // 同城配送详情
  ['GET', '/v4/trade/delivery/local/cityDetail.json', 'delivery.DeliveryController', 'cityDetail'],
  // 同城配送取消呼叫
  [
    'POST',
    '/v4/trade/delivery/local/cancelCall.json',
    'delivery.DeliveryController',
    'deliveryCancelCall',
  ],
  // 重新呼叫配送员
  ['POST', '/v4/trade/delivery/local/reCall.json', 'delivery.DeliveryController', 'reCall'],
  // 加小费
  ['POST', '/v4/trade/delivery/local/addTip.json', 'delivery.DeliveryController', 'addTip'],
  // 取消自动呼叫
  [
    'POST',
    '/v4/trade/delivery/local/cancelAutoCall.json',
    'delivery.DeliveryController',
    'cancelAutoCall',
  ],
  // 获取快递公司的列表,分别包括推荐物流、按首字母分组、常用物流
  [
    'GET',
    '/v4/trade/delivery/allExpressInfo.json',
    'delivery.DeliveryController',
    'getExpressShowList',
  ],
  // 延长收货
  [
    'POST',
    '/v4/trade/delivery/orderDelayReceive.json',
    'delivery.DeliveryController',
    'orderDelayReceive',
  ],
  // 查询延迟收货操作明细
  [
    'GET',
    '/v4/trade/delivery/queryDelayReceiveDetail.json',
    'delivery.DeliveryController',
    'queryDelayReceiveDetail',
  ],
  [
    'GET',
    '/v4/trade/delivery/wechat/config/search.json',
    'delivery.DeliveryController',
    'searchWechatDeliveryConfig',
  ],
  // 查询同城配送允许自己联系快递发货方式的商家名单
  [
    'GET',
    '/v4/trade/delivery/isAllowLocalExpress.json',
    'delivery.DeliveryController',
    'isAllowLocalExpress',
  ],
];
