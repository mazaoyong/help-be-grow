module.exports = [
  [
    // 我的线索，全部线索线索池
    'GET',
    '/v4/vis/edu/page/clue/pool',
    'recruit.clue.CluePoolController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 全部线索
    'GET',
    '/v4/vis/edu/page/clue/all',
    'recruit.clue.CluePoolController',
    'getAllIndexHtml',
  ],
  [
    // 我的线索
    'GET',
    '/v4/vis/edu/page/clue/mine',
    'recruit.clue.CluePoolController',
    'getMineIndexHtml',
  ],
  ['GET', '/v4/vis/edu/clue/findAll.json', 'recruit.clue.CluePoolController', 'findAllByPage'],
  [
    'GET',
    '/v4/vis/edu/clue/findPool.json',
    'recruit.clue.CluePoolController',
    'findPublicPoolByPage',
  ],
  ['GET', '/v4/vis/edu/clue/findMine.json', 'recruit.clue.CluePoolController', 'findMyClueByPage'],
  ['GET', '/v4/vis/edu/clue/findAllWithCount.json', 'recruit.clue.CluePoolController', 'findAllByPageWithCount'],
  [
    'GET',
    '/v4/vis/edu/clue/findPoolWithCount.json',
    'recruit.clue.CluePoolController',
    'findPublicPoolByPageWithCount',
  ],
  ['GET', '/v4/vis/edu/clue/findMineWithCount.json', 'recruit.clue.CluePoolController', 'findMyClueByPageWithCount'],
  [
    'GET',
    '/v4/vis/edu/clue/findAttributeItems.json',
    'recruit.clue.CluePoolController',
    'findAttributeItems',
  ],
  [
    'GET',
    '/v4/vis/edu/clue/find-unified-attribute-items.json',
    'recruit.clue.CluePoolController',
    'findUnifiedAttributeItems',
  ],
  ['POST', '/v4/vis/edu/clue/createClue.json', 'recruit.clue.CluePoolController', 'createClue'],
  ['POST', '/v4/vis/edu/clue/updateClue.json', 'recruit.clue.CluePoolController', 'updateClue'],
  [
    // 线索详情
    'GET',
    '/v4/vis/edu/clue/getDetailById.json',
    'recruit.clue.CluePoolController',
    'getDetailById',
  ],
  [
    // 线索详情脱敏
    'GET',
    '/v4/vis/edu/clue/getDetailByIdForHide.json',
    'recruit.clue.CluePoolController',
    'getDetailByIdForHide',
  ],
  [
    // 修改线索状态
    'POST',
    '/v4/vis/edu/clue/changeState.json',
    'recruit.clue.CluePoolController',
    'changeState',
  ],
  [
    // 查询相关订单
    'GET',
    '/v4/vis/edu/clue/queryRelatedOrder.json',
    'recruit.clue.CluePoolController',
    'queryRelatedOrder',
  ],
  [
    // 查询线索订单归属校区
    'GET',
    '/v4/vis/edu/clue/checkOrderBelongsTo.json',
    'recruit.clue.CluePoolController',
    'checkOrderBelongsTo',
  ],
  [
    // 领取线索(批量)
    'POST',
    '/v4/vis/edu/clue/takeClues.json',
    'recruit.clue.CluePoolController',
    'takeClues',
  ],
  [
    // 分配线索(批量)
    'POST',
    '/v4/vis/edu/clue/distributeClues.json',
    'recruit.clue.CluePoolController',
    'distributeClues',
  ],
  [
    // 放弃线索(批量）
    'POST',
    '/v4/vis/edu/clue/giveUpClues.json',
    'recruit.clue.CluePoolController',
    'giveUpClues',
  ],
  [
    // 删除线索(批量）
    'POST',
    '/v4/vis/edu/clue/deleteClues.json',
    'recruit.clue.CluePoolController',
    'deleteClues',
  ],
  [
    // 还原线索(批量）
    'POST',
    '/v4/vis/edu/clue/restoreClues.json',
    'recruit.clue.CluePoolController',
    'restoreClues',
  ],
  [
    // 永久删除线索(批量）
    'POST',
    '/v4/vis/edu/clue/permanentlyDeleteClues.json',
    'recruit.clue.CluePoolController',
    'permanentlyDeleteClues',
  ],
  [
    // 转让线索(批量)
    'POST',
    '/v4/vis/edu/clue/transferClues.json',
    'recruit.clue.CluePoolController',
    'transferClues',
  ],
  [
    // 线索标签更新
    'POST',
    '/v4/vis/edu/clue/updateClueTags.json',
    'recruit.clue.CluePoolController',
    'updateClueTags',
  ],
  [
    // 分页查询跟进记录列表
    'GET',
    '/v4/vis/edu/clue/findPageClueRecords.json',
    'recruit.clue.CluePoolController',
    'findPageClueRecords',
  ],
  [
    // 线索详情页添加跟进记录
    'POST',
    '/v4/vis/edu/clue/createClueRecord.json',
    'recruit.clue.CluePoolController',
    'createClueRecord',
  ],
  [
    // 线索详情页更新跟进记
    'POST',
    '/v4/vis/edu/clue/updateClueRecord.json',
    'recruit.clue.CluePoolController',
    'updateClueRecord',
  ],
  [
    // 分页查询线索标签
    'GET',
    '/v4/vis/edu/clue/findTagGroupPage.json',
    'recruit.clue.ClueTagsController',
    'findTagGroupPage',
  ],
  ['GET', '/v4/vis/edu/clue/findMyRole.json', 'recruit.clue.CluePoolController', 'findMyRole'],

  [
    // 创建线索导出任务
    'POST',
    '/v4/vis/edu/clue/exportClue.json',
    'recruit.clue.CluePoolController',
    'postExportClueJson'
  ]
];
