// 好友助理
module.exports = [
  [
    // 页面render
    'GET',
    '/v4/vis/pct/page/boost',
    'ump.BoostController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 创建好友助力
    'POST',
    '/v4/vis/pct/boost/active.json',
    'ump.BoostController',
    'createAvtive',
  ],
  [
    // 删除好友助力
    'DELETE',
    '/v4/vis/pct/boost/active.json',
    'ump.BoostController',
    'deleteActive',
  ],
  [
    // 修改好友助力
    'PUT',
    '/v4/vis/pct/boost/active.json',
    'ump.BoostController',
    'updateAvtive',
  ],
  [
    // 结束活动
    'PUT',
    '/v4/vis/pct/boost/invalid.json',
    'ump.BoostController',
    'invalidActive',
  ],
  [
    // 获取好友助力列表
    'GET',
    '/v4/vis/pct/boost/activeList.json',
    'ump.BoostController',
    'getActiveList',
  ],
  [
    // 获取好友助力
    'GET',
    '/v4/vis/pct/boost/active.json',
    'ump.BoostController',
    'getActive',
  ],
  [
    // 结束活动
    'GET',
    '/v4/vis/pct/boost/goodsList.json',
    'ump.BoostController',
    'getGoodsListJson',
  ],
  [
    // 获取好友助力列表
    'GET',
    '/v4/vis/pct/boost/selectedGoodsList.json',
    'ump.BoostController',
    'getSelectedGoodsListJson',
  ],
  [
    'POST',
    '/v4/vis/pct/boost/historyList.json',
    'ump.BoostController',
    'listHistoryListJson',
  ],
  [
    // 创建好友助力
    'POST',
    '/v4/vis/pct/boost/activity.json',
    'ump.BoostController',
    'createActivity',
  ],
  [
    // 修改好友助力
    'PUT',
    '/v4/vis/pct/boost/activity.json',
    'ump.BoostController',
    'updateActivity',
  ],
];
