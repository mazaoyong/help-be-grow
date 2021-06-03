module.exports = [
  [
    // 线索导入页面
    'GET',
    '/v4/vis/ump/clue/import',
    'ump.ClueController',
    'getClueImportHTML',
  ],
  [
    // 我的线索，全部线索线索池
    'GET',
    '/v4/vis/ump/clue/pool',
    'ump.ClueController',
    ['initVisPage', 'getCluePoolHtml'],
  ],
  [
    // 全部线索
    'GET',
    '/v4/vis/ump/clue/all',
    'ump.ClueController',
    'getAllClueHtml',
  ],
  [
    // 我的线索
    'GET',
    '/v4/vis/ump/clue/mine',
    'ump.ClueController',
    'getMyClueHtml',
  ],
  [
    // 线索回收站页面
    'GET',
    '/v4/vis/ump/clue/recycle',
    'ump.ClueController',
    'getClueRecycleHTML',
  ],
  [
    // 线索设置
    'GET',
    '/v4/vis/ump/clue/setting',
    'ump.ClueController',
    'getClueSettingHTML',
  ],
  [
    // 线索来源
    'GET',
    '/v4/vis/ump/clue/source',
    'ump.ClueController',
    'getClueSourceHtml',
  ],
  [
    // 线索标签页面
    'GET',
    '/v4/vis/ump/clue/tags',
    'ump.ClueController',
    'getClueTagsHTML',
  ],
  [
    // 线索流转
    'GET',
    '/v4/vis/ump/clue/transfer',
    'ump.ClueController',
    'getClueTransferHTML',
  ],
];
