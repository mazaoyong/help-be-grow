module.exports = [
  ['GET', '/v4/vis/edu/page/refund-record', 'recruit.refund.RefundRecordController', 'getIndexHtml'],
  [
    'GET',
    '/v4/vis/edu/page/refund/list.json',
    'recruit.refund.RefundRecordController',
    'getRefundRecordList',
  ],
  [
    'GET',
    '/v4/vis/edu/page/refund/getStaffList.json',
    'recruit.refund.RefundRecordController',
    'getStaffList',
  ],
  [
    'GET',
    '/v4/vis/edu/page/refund/getSingleShopStaffList.json',
    'recruit.refund.RefundRecordController',
    'getSingleShopStaffList',
  ],
  [
    'GET',
    '/v4/vis/edu/page/refund/getRefundRecordByRefundNo.json',
    'recruit.refund.RefundRecordController',
    'getRefundRecordByRefundNo',
  ],
  [
    'GET',
    '/v4/vis/edu/page/refund/getRefundRecordByQuery.json',
    'recruit.refund.RefundRecordController',
    'getRefundRecordByQuery',
  ],

  ['GET', '/v4/vis/edu/page/refund', 'recruit.refund.RefundController', 'getIndexHtml'],
  ['GET', '/v4/vis/edu/refund/getPreRefundFromOrder.json', 'recruit.refund.RefundController', 'getPreRefundFromOrder'],
  ['GET', '/v4/vis/edu/refund/getPreRefundFromUser.json', 'recruit.refund.RefundController', 'getPreRefundFromUser'],
  ['GET', '/v4/vis/edu/refund/queryAssetRefundPhasePriceInfo.json', 'recruit.refund.RefundController', 'queryAssetRefundPhasePriceInfo'],
  ['POST', '/v4/vis/edu/refund/refund.json', 'recruit.refund.RefundController', 'refund'],
  ['GET', '/v4/vis/edu/refund/findBuyGivePresentPageByCondition.json', 'recruit.refund.RefundController', 'findBuyGivePresentPageByCondition'],
];
