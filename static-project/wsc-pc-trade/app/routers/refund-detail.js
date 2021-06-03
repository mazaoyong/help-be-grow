module.exports = [
  // 退款详情页
  ['GET', '/v4/trade/refund/detail', 'refund.RefundDetailController', 'getIndexHtml'],
  // 退款详情数据
  ['GET', '/v4/trade/refund/detail/fetch.json', 'refund.RefundDetailController', 'getDetailJson'],
  // 退款前请求
  ['GET', '/v4/trade/refund/detail/preCheck.json', 'refund.RefundDetailController', 'preCheck'],
  // 发布留言
  ['POST', '/v4/trade/refund/detail/message.json', 'refund.RefundDetailController', 'postMessage'],
  // 同意退款
  ['POST', '/v4/trade/refund/detail/accept.json', 'refund.RefundDetailController', 'accept'],
  // 拒绝退款
  ['POST', '/v4/trade/refund/detail/reject.json', 'refund.RefundDetailController', 'reject'],
  // 确认收货并退款
  ['POST', '/v4/trade/refund/detail/sign.json', 'refund.RefundDetailController', 'sign'],
  // 拒绝确认收货(退款流程)
  ['POST', '/v4/trade/refund/detail/unsign.json', 'refund.RefundDetailController', 'unsign'],
  // 同意换货
  [
    'POST',
    '/v4/trade/refund/detail/exchangeAgree.json',
    'refund.RefundDetailController',
    'exchangeAgree',
  ],
  // 拒绝换货
  [
    'POST',
    '/v4/trade/refund/detail/exchangeReject.json',
    'refund.RefundDetailController',
    'exchangeReject',
  ],
  // 确认收货并发货(换货流程)
  [
    'POST',
    '/v4/trade/refund/detail/deliveryExchangeGoods.json',
    'refund.RefundDetailController',
    'deliveryExchangeGoods',
  ],
  // 拒绝确认收货(换货流程)
  [
    'POST',
    '/v4/trade/refund/detail/exchangeUnsign.json',
    'refund.RefundDetailController',
    'exchangeUnsign',
  ],
  // 查询下一单
  ['GET', '/v4/trade/refund/detail/queryNext.json', 'refund.RefundDetailController', 'queryNext'],
];
