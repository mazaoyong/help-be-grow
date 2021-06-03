module.exports = [
  [
    // 线索回收站页面
    'GET',
    '/v4/vis/edu/page/clue/recycle',
    'recruit.clue.ClueRecycleController',
    'getIndexHTML',
  ],
  [
    // 线索回收站查询
    'GET',
    '/v4/vis/edu/clue/findClueInRecycleBinByPage.json',
    'recruit.clue.ClueRecycleController',
    'findClueInRecycleBinByPage',
  ],
];
