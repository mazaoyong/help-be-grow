module.exports = [
  // 分销采购单列表
  [
    'GET',
    ['/v4/trade/order/sellerorder', '/v4/trade/order/confirm'],
    'fxseller.FxSellerListController',
    'index',
  ],
  // 分销采购单搜索
  [
    'GET',
    '/v4/trade/order/sellerorderlist.json',
    'fxseller.FxSellerListController',
    'getPurchaseOrderList',
  ],
  // 根据分销单主动支付采购单
  [
    'POST',
    '/v4/trade/order/confirm/pay.json',
    'fxseller.FxSellerListController',
    'payPurchaseOrder',
  ],
  // 根据分销单，批量查询采购单主动付货款信息
  [
    'POST',
    '/v4/trade/order/confirm/orderInfo.json',
    'fxseller.FxSellerListController',
    'getActivePayInfo',
  ],
  // 查询采购单批量支付结果
  [
    'GET',
    '/v4/trade/order/confirm/payResult.json',
    'fxseller.FxSellerListController',
    'getActivePayProcessInfo',
  ],
  // 分销采购单导出接口
  [
    'POST',
    '/v4/trade/order/confirm/export.json',
    'fxseller.FxSellerListController',
    'exportFxOrder',
  ],
];
