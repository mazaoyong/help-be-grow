module.exports = [
  ['GET', '/v4/trade/order/listPrinters.json', 'order.PrintController', 'listPrinters'],
  [
    'POST',
    '/v4/trade/order/printCateringTicket.json',
    'order.PrintController',
    'printCateringTicket',
  ],
  [
    'GET',
    '/v4/trade/order/listAllLinkedPrinters.json',
    'order.PrintController',
    'listAllLinkedPrinters',
  ],
  [
    'POST',
    '/v4/trade/order/printOrderAfterMultiStore.json',
    'order.PrintController',
    'printOrderAfterMultiStore',
  ],
  ['POST', '/v4/trade/order/printOrder.json', 'order.PrintController', 'printOrder'],
  // 获取小票打印升级状态
  [
    'GET',
    '/v4/trade/order/printer/upgrade-status.json',
    'order.PrintController',
    'getUpgradeStatus',
  ],
  // 升级零售小票后使用的打印接口
  ['POST', '/v4/trade/order/printByOrderNo.json', 'order.PrintController', 'printByOrderNo'],
  // 升级零售小票后使用的堂食小票打印接口
  ['POST', '/v4/trade/order/printPendOrder.json', 'order.PrintController', 'printPendOrder'],
];
