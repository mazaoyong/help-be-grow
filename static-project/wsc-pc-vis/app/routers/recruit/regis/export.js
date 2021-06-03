module.exports = [
  // 请求html
  [
    'GET',
    '/v4/vis/edu/page/regis/export',
    'recruit.regis.ExportController',
    ['initUserInfo', 'getIndexHtml'],
  ],

  // 查看已导出报表列表
  [
    'POST',
    '/v4/vis/edu/regis/export/findPageExportedReportForm.json',
    'recruit.regis.ExportController',
    'findPageExportedReportForm',
  ],
];
