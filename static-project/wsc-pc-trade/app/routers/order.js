module.exports = [
  ['GET', '/v4/trade/order/orderItem.json', 'order.OrderController', 'getOrderItem'],
  ['POST', '/v4/trade/order/ticket.json', 'order.OrderController', 'ticket'],
  [
    'GET',
    '/v4/trade/order/checkIsShowFreightInsuranceBanner.json',
    'order.OrderController',
    'checkIsShowFreightInsuranceBanner',
  ],
  // 获取连锁子店铺
  ['GET', '/v4/trade/order/findShopNodeList.json', 'order.OrderController', 'findShopNodeList'],
  [
    'PUT',
    '/v4/trade/order/notShowFreightInsuranceBanner.json',
    'order.OrderController',
    'notShowFreightInsuranceBanner',
  ],
  ['GET', '/v4/trade/order/expressList.json', 'order.OrderController', 'getExpressList'],
  ['PUT', '/v4/trade/order/modifyExpress.json', 'order.OrderController', 'modifyExpress'],
  [
    'GET',
    '/v4/trade/order/definedExportRule.json',
    'order.ExportController',
    'getDefinedExportRule',
  ],
  ['GET', '/v4/trade/order/reportFields.json', 'order.ExportController', 'queryReportFields'],
  ['POST', '/v4/trade/order/saveReportFields.json', 'order.ExportController', 'saveReportFields'],
  ['POST', '/v4/trade/order/export.json', 'order.ExportController', 'export'],
  ['GET', '/v4/trade/order/listInvoice.json', 'order.OrderController', 'listInvoice'],
  ['PUT', '/v4/trade/order/cancelOrder.json', 'order.OrderController', 'cancelOrder'],
  [
    'POST',
    '/v4/trade/order/setWriteOffConfig.json',
    'order.SelfFetchOrderController',
    'setWriteOffConfig',
  ],
  // 获取自主核销状态
  [
    'GET',
    '/v4/trade/order/getWriteOffConfig.json',
    'order.SelfFetchOrderController',
    'getWriteOffConfig',
  ],
  ['POST', '/v4/trade/order/cancelFoodOrder.json', 'order.FoodOrderController', 'cancelOrder'],
  // 分页获取送礼子订单列表
  ['GET', '/v4/trade/order/gift/list.json', 'order.GiftOrderController', 'queryGiftOrderInfoPage'],
  // 分页获取子订单列表
  ['GET', '/v4/trade/order/child/list.json', 'order.GiftOrderController', 'queryChildOrderList'],
  // 获取物流详情
  [
    'POST',
    '/v4/trade/order/gift/express.json',
    'order.GiftOrderController',
    'queryDistOrderByRecordNo',
  ],
  [
    'GET',
    '/v4/trade/order/getOrderNumAndVoice.json',
    'order.OrderController',
    'getOrderNumAndVoice',
  ],
  // 接单
  ['POST', '/v4/trade/order/confirmOrder.json', 'order.OrderController', 'confirmOrder'],
  // 拒单
  ['POST', '/v4/trade/order/rejectOrder.json', 'order.OrderController', 'rejectOrder'],
  // 酒店-接单
  ['POST', '/v4/trade/order/confirmHotelOrder.json', 'order.OrderController', 'confirmHotelOrder'],
  // 酒店-拒单
  ['POST', '/v4/trade/order/rejectHotelOrder.json', 'order.OrderController', 'rejectHotelOrder'],
  // 酒店-入住
  ['POST', '/v4/trade/order/checkInHotelOrder.json', 'order.OrderController', 'checkInHotelOrder'],
  ['GET', '/v4/trade/order/listRejectReasons.json', 'order.OrderController', 'listRejectReasons'],
  ['GET', '/v4/trade/order/getStaffList.json', 'order.OrderController', 'getStaffList'],
  [
    'GET',
    '/v4/trade/order/getSingleShopStaffList.json',
    'order.OrderController',
    'getSingleShopStaffList',
  ],
  ['GET', '/v4/trade/order/getByOrderNo.json', 'order.OrderController', 'getByOrderNo'],
  ['GET', '/v4/trade/order/getReceiptV2.json', 'order.OrderController', 'getReceiptV2'],
  [
    'GET',
    '/v4/trade/order/getGiveawayByOrderNo.json',
    'order.OrderController',
    'getGiveawayByOrderNo',
  ],
  ['GET', '/v4/trade/api/order/getPriceInfo.json', 'order.OrderController', 'getPriceInfo'],
  ['POST', '/v4/trade/api/order/changePrice.json', 'order.OrderController', 'changePrice'],
  ['POST', '/v4/trade/api/order/delivery.json', 'order.OrderController', 'delivery'],
  ['GET', '/v4/trade/api/order/getQrcode.json', 'order.OrderController', 'getQrcode'],
  ['POST', '/v4/trade/api/order/deliveryWindow.json', 'order.OrderController', 'deliveryWindow'],
  ['GET', '/v4/trade/api/order/deliveryWindow.json', 'order.OrderController', 'deliveryWindowGet'],
  ['GET', '/v4/trade/api/order/getPrepayInfo.json', 'order.OrderController', 'getPrepayInfo'],
  ['GET', '/v4/trade/api/order/getOrderInfo.json', 'order.OrderController', 'getOrderInfo'],
  [
    'GET',
    '/v4/trade/api/order/getPayToolsByEduKdtId.json',
    'order.OrderController',
    'getPayToolsByEduKdtId',
  ],
  ['POST', '/v4/trade/api/order/pay.json', 'order.OrderController', 'pay'],
];
