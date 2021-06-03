module.exports = [
  [
    // 线索流转
    'GET',
    '/v4/vis/edu/page/clue/transfer',
    'recruit.clue.ClueTransferController',
    'getIndexHTML',
  ],
  [
    // 分页查询流转原因
    'GET',
    '/v4/vis/edu/clue/findTransferReason.json',
    'recruit.clue.ClueTransferController',
    'findTransferReasonPageByQuery',
  ],
  [
    // 创建流转原因
    'POST',
    '/v4/vis/edu/clue/createTransferReason.json',
    'recruit.clue.ClueTransferController',
    'createTransferReason',
  ],
  [
    // 更新流转原因
    'POST',
    '/v4/vis/edu/clue/updateTransferReason.json',
    'recruit.clue.ClueTransferController',
    'updateTransferReason',
  ],
  [
    // 删除流转原因
    'POST',
    '/v4/vis/edu/clue/deleteTransferReason.json',
    'recruit.clue.ClueTransferController',
    'deleteTransferReason',
  ],
  [
    'GET',
    '/v4/vis/edu/clue/findTransferReasonPageByQuery.json',
    'recruit.clue.ClueTransferController',
    'findTransferReasonPageByQuery',
  ],
  [
    // 查看线索是否可以转化为学员
    'GET',
    '/v4/vis/edu/clue/checkClueMerge.json',
    'recruit.clue.CluePlatMergeController',
    'checkClueMerge',
  ],
  [
    // 转化确认接口
    'POST',
    '/v4/vis/edu/clue/confirmClueMerge.json',
    'recruit.clue.CluePlatMergeController',
    'confirmClueMerge',
  ],
];
