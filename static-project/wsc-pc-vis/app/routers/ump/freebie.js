module.exports = [
  [
    // 页面render
    'GET',
    '/v4/vis/pct/page/freebie',
    'ump.FreebieController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 买赠列表
    'GET',
    '/v4/vis/pct/freebie/lists.json',
    'ump.FreebieController',
    'getListsJson',
  ],
  [
    // 获取商品
    'GET',
    '/v4/vis/pct/freebie/knowledgeByAlias.json',
    'ump.FreebieController',
    'getKnowledgeByAliasJson',
  ],
  [
    // 获取商品列表
    'GET',
    '/v4/vis/pct/freebie/knowledgeList.json',
    'ump.FreebieController',
    'getKnowledgeList',
  ],
  [
    // 删除买赠
    'DELETE',
    '/v4/vis/pct/freebie/active.json',
    'ump.FreebieController',
    'deleteActiveJson',
  ],
  [
    // 查询买赠效果数据
    'GET',
    '/v4/vis/pct/freebie/effectData.json',
    'ump.FreebieController',
    'getEffectDataJson',
  ],
  [
    'GET',
    '/v4/vis/pct/freebie/findPage.json',
    'ump.FreebieController',
    'findPage',
  ],
  [
    // 查询买赠详情
    'GET',
    '/v4/vis/pct/freebie/getDetailById.json',
    'ump.FreebieController',
    'getDetailById',
  ],
  [
    // 创建买赠
    'POST',
    '/v4/vis/pct/freebie/create.json',
    'ump.FreebieController',
    'create',
  ],
  [
    // 更新买赠
    'POST',
    '/v4/vis/pct/freebie/update.json',
    'ump.FreebieController',
    'update',
  ],
  [
    'POST',
    '/v4/vis/pct/freebie/invalid.json',
    'ump.FreebieController',
    'invalid',
  ],
  [
    'GET',
    '/v4/vis/pct/freebie/findWithSku.json',
    'ump.FreebieController',
    'findWithSku',
  ],
];
