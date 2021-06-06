module.exports = [
  [
    '超卖订单补货',
    'POST',
    '/v4/trade/order/overSaleRestock.json',
    'order.OrderProcessController',
    'overSaleRestock',
  ],
  [
    '超卖订单退款',
    'POST',
    '/v4/trade/order/overSaleRefund.json',
    'order.OrderProcessController',
    'overSaleRefund',
  ],
  [
    '周期购-发货记录',
    'GET',
    '/v4/trade/order/periodDeliveryRecords.json',
    'order.OrderProcessController',
    'periodDeliveryRecords',
  ],
  [
    '周期购-查看配送日历',
    'GET',
    '/v4/trade/order/periodCalendar.json',
    'order.OrderProcessController',
    'periodCalendar',
  ],
  [
    '周期购-确认改期',
    'POST',
    '/v4/trade/order/periodChangeDate.json',
    'order.OrderProcessController',
    'periodChangeDate',
  ],
  [
    '周期购-恢复配送',
    'POST',
    '/v4/trade/order/periodRecoverySend.json',
    'order.OrderProcessController',
    'periodRecoverySend',
  ],
  [
    '查询物流轨迹',
    'GET',
    '/v4/trade/order/getDeliveryInfo.json',
    'order.OrderProcessController',
    'getDeliveryInfo',
  ],
];