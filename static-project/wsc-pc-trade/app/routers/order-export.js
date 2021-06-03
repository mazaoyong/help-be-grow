module.exports = [
  ['POST', '/v4/trade/order/export/new.json', 'order.ExportControllerV2', 'export'],
  ['GET', '/v4/trade/order/export/fields.json', 'order.ExportControllerV2', 'getFields'],
  [
    'GET',
    '/v4/trade/order/export/fields/customized.json',
    'order.ExportControllerV2',
    'getCustomizedFields',
  ],
  [
    'POST',
    '/v4/trade/order/export/fields/customized.json',
    'order.ExportControllerV2',
    'saveCustomizedFields',
  ],
  [
    'GET',
    '/v4/trade/order/export/fields/queryPrivateUrl.json',
    'order.ExportControllerV2',
    'queryPrivateUrl',
  ],
];
