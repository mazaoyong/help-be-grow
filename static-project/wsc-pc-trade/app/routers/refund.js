module.exports = [
  ['GET', '/v4/trade/refund/export-list', 'refund.ExportListController', 'getIndexHtml'],
  ['GET', '/v4/trade/refunds', 'refund.RefundsController', 'getIndexHtml'],
  ['GET', '/v4/trade/order/refund', 'refund.RefundsController', 'getRefundDetailHtml'],
  ['GET', '/v4/trade/refund/list.json', 'refund.RefundsController', 'getRefundList'],
  // 钱款去向
  ['GET', '/v4/trade/refund/detail.json', 'refund.RefundsController', 'getRefundDetail'],
  //
  [
    'GET',
    '/v4/trade/refund/refundprocedure.json',
    'refund.RefundsController',
    'getRefundProcedure',
  ],
  [
    'POST',
    '/v4/trade/refund/operate/is-allow.json',
    'refund.RefundsController',
    'getIsAllowBatchOperate',
  ],
  [
    'GET',
    '/v4/trade/refund/operate/is-allow.json',
    'refund.RefundsController',
    'queryIsAllowBatchOperate',
  ],
  [
    'POST',
    '/v4/trade/refund/operate/result.json',
    'refund.RefundsController',
    'getRefundsOperateResult',
  ],
  [
    'GET',
    '/v4/trade/refund/operate/result.json',
    'refund.RefundsController',
    'queryRefundOperateResult',
  ],
  // 拒绝退款申请 / 退货退款申请
  ['POST', '/v4/trade/refund/operate/refuse.json', 'refund.RefundsController', 'refuseRefunds'],
  // 拒绝退货申请
  [
    'POST',
    '/v4/trade/refund/operate/refuse/sales-return.json',
    'refund.RefundsController',
    'refuseGoodsReturn',
  ],
  // 同意退货退款申请
  [
    'POST',
    '/v4/trade/refund/operate/agree/goods-return.json',
    'refund.RefundsController',
    'agreeGoodsReturn',
  ],
  // 同意退款申请 / 同意退货申请
  ['POST', '/v4/trade/refund/operate/agree.json', 'refund.RefundsController', 'agreeRefunds'],
  ['GET', '/v4/trade/refund/address.json', 'refund.RefundsController', 'getRefundAddress'],
  // 获取当前店铺退货地址
  [
    'GET',
    '/v4/trade/query/refund/address.json',
    'refund.RefundsController',
    'queryRefundAddressList',
  ],
  // 获取零售所有店铺退货地址
  [
    'GET',
    '/v4/trade/query/refund/all-address.json',
    'refund.RefundsController',
    'queryAllRefundAddressList',
  ],
  // 售后记录导出
  ['POST', '/v4/trade/refund/export.json', 'refund.RefundsController', 'exportRefunds'],
  // 获取售后导出记录列表
  ['GET', '/v4/trade/refund/export-list/list.json', 'refund.ExportListController', 'getListJson'],
];
