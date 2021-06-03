module.exports = [
  [
    // 线索导入页面
    'GET',
    '/v4/vis/edu/page/clue/import',
    'recruit.clue.ClueImportController',
    'getIndexHTML',
  ],
  [
    // 分页获取线索列表
    'GET',
    '/v4/vis/edu/clue/import/getClueList.json',
    'recruit.clue.ClueImportController',
    'getClueListJSON',
  ],
  [
    // 创建线索导入模板
    'POST',
    '/v4/vis/edu/clue/import/getImporTemp.json',
    'recruit.clue.ClueImportController',
    'getImporTempJson',
  ],
  [
    // 创建线索导入任务
    'POST',
    '/v4/vis/edu/clue/import/createImportTask.json',
    'recruit.clue.ClueImportController',
    'createImportTaskJson',
  ],
  [
    'GET',
    '/v4/vis/edu/clue/import/getUploadToken.json',
    'recruit.clue.ClueImportController',
    'getUploadToken',
  ],
  [
    // 获取员工列表
    'GET',
    '/v4/vis/edu/clue/import/getStaffList.json',
    'recruit.clue.ClueImportController',
    'getStaffListJson',
  ],
];
