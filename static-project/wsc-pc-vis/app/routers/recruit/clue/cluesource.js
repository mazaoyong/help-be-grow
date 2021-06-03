module.exports = [
  [
    // 线索来源
    'GET',
    '/v4/vis/edu/page/clue/source',
    'recruit.clue.ClueSourceController',
    'getIndexHtml',
  ],
  [
    // 查询线索来源分组
    'GET',
    '/v4/vis/edu/clue/findSourceGroupList.json',
    'recruit.clue.ClueSourceController',
    'findSourceGroupList',
  ],
  [
    // 查询线索来源分组(大)
    'GET',
    '/v4/vis/edu/clue/findSourceGroupPage.json',
    'recruit.clue.ClueSourceController',
    'findSourceGroupPage',
  ],
  [
    // 创建线索来源分组
    'POST',
    '/v4/vis/edu/clue/createSourceGroup.json',
    'recruit.clue.ClueSourceController',
    'createSourceGroup',
  ],
  [
    // 更新线索来源分组
    'POST',
    '/v4/vis/edu/clue/updateSourceGroup.json',
    'recruit.clue.ClueSourceController',
    'updateSourceGroup',
  ],
  [
    // 删除线索来源分组
    'POST',
    '/v4/vis/edu/clue/deleteSourceGroup.json',
    'recruit.clue.ClueSourceController',
    'deleteSourceGroup',
  ],
  [
    // 查询线索来源
    'GET',
    '/v4/vis/edu/clue/findSourcePage.json',
    'recruit.clue.ClueSourceController',
    'findSourcePage',
  ],
  [
    // 创建线索来源
    'POST',
    '/v4/vis/edu/clue/createSource.json',
    'recruit.clue.ClueSourceController',
    'createSource',
  ],
  [
    // 更新线索来源
    'POST',
    '/v4/vis/edu/clue/updateSource.json',
    'recruit.clue.ClueSourceController',
    'updateSource',
  ],
  [
    // 批量更改线索来源分组
    'POST',
    '/v4/vis/edu/clue/changeSourceGroup.json',
    'recruit.clue.ClueSourceController',
    'changeGroup',
  ],
  [
    // 批量删除线索来源
    'POST',
    '/v4/vis/edu/clue/batchDeleteSource.json',
    'recruit.clue.ClueSourceController',
    'batchDeleteSource',
  ],
];
