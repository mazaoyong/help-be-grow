// 批量发货
module.exports = [
  ['GET', '/v4/trade/delivery/batch', 'delivery.BatchDeliveryController', 'getIndexHtml'],
  ['GET', '/v4/trade/delivery/batch/list.json', 'delivery.BatchDeliveryController', 'getList'],
  [
    'POST',
    '/v4/trade/delivery/batch/upload.json',
    'delivery.BatchDeliveryController',
    'uploadBatch',
  ],
  [
    'POST',
    '/v4/trade/delivery/batch/modify.json',
    'delivery.BatchDeliveryController',
    'modifyBatch',
  ],
  [
    'GET',
    '/v4/trade/delivery/batch/token.json',
    'delivery.BatchDeliveryController',
    'getUploadToken',
  ],
  [
    'GET',
    '/v4/trade/delivery/batch/progress.json',
    'delivery.BatchDeliveryController',
    'queryProgressByNo',
  ],
];
