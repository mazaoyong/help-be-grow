module.exports = [
  [
    // 页面render
    'GET',
    ['/v4/vis/pct/page/record', '/v4/vis/pct/page/record/*'],
    'ump.RecordController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 查询订购记录列表
    'GET',
    '/v4/vis/pct/record/list.json',
    'ump.RecordController',
    'getListJson',
  ],
  [
    // 导出订购记录
    'POST',
    '/v4/vis/pct/record/export.json',
    'ump.RecordController',
    'getExportJson',
  ],
  [
    // 导出文件列表
    'GET',
    '/v4/vis/pct/records/export/list.json',
    'ump.RecordController',
    'getExportsLists',
  ],
  [
    // 新的导出文件列表
    'GET',
    '/v4/vis/pct/records/export/findPageByCondition.json',
    'ump.RecordController',
    'findPageByCondition',
  ],
  [
    'POST',
    '/v4/vis/pct/records/export/getDownLoadUrlById.json',
    'ump.RecordController',
    'getDownLoadUrlById'
  ]
];
