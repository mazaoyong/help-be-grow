module.exports = [
  [
    // 页面render
    'GET',
    '/v4/vis/pct/page/poster',
    'ump.PosterController',
    ['initVisPage', 'redirectToNewUrl'],
  ],
  [
    // 海报列表
    'GET',
    '/v4/vis/pct/poster/lists.json',
    'ump.PosterController',
    'getListsJson',
  ],
  [
    // 效果列表
    'GET',
    '/v4/vis/pct/poster/effectLists.json',
    'ump.PosterController',
    'getEffectListsJson',
  ],
  [
    // 创建海报活动
    'POST',
    '/v4/vis/pct/poster/active.json',
    'ump.PosterController',
    'postActiveJson',
  ],
  [
    // 删除海报活动
    'DELETE',
    '/v4/vis/pct/poster/active.json',
    'ump.PosterController',
    'deleteActiveJson',
  ],
  [
    // 获取海报详情
    'GET',
    '/v4/vis/pct/poster/active.json',
    'ump.PosterController',
    'getActiveJson',
  ],
  [
    // 更新海报活动
    'PUT',
    '/v4/vis/pct/poster/active.json',
    'ump.PosterController',
    'putActiveJson',
  ],
  [
    // 推广海报活动
    'GET',
    '/v4/vis/pct/poster/popularize.json',
    'ump.PosterController',
    'popularize',
  ],
  [
    // 结束海报活动
    'GET',
    '/v4/vis/pct/poster/terminate.json',
    'ump.PosterController',
    'terminate',
  ],
];
