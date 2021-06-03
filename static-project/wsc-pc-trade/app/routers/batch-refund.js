const controller = `batch-refund.IndexController`;
const apiPrefix = `/v4/trade/batch-refund`;
module.exports = [
  ['批量退款页', 'GET', apiPrefix, controller, 'getIndexHtml'],
  [
    '批量退款历史记录',
    'GET',
    `${apiPrefix}/getBatchRefundList.json`,
    controller,
    'getBatchRefundList',
  ],
  [
    '批量退款文件上传TOKEN',
    'GET',
    `${apiPrefix}/getUploadTokon.json`,
    controller,
    'getUploadTokon',
  ],
  ['操作批量退款', 'POST', `${apiPrefix}/doRefund.json`, controller, 'doRefund'],
  [
    '查询当天操作次数是否超过3次',
    'GET',
    `${apiPrefix}/isOverBatchRefundTime.json`,
    controller,
    'isOverBatchRefundTime',
  ],
];
