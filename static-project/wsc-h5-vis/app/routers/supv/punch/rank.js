const routePrefix = '/wscvis/supv/punch/rank';
const controllerPath = 'supv.punch.RankController';

/**
 * 群打卡排行榜/打卡日历接口
 */
module.exports = [
  // 获取个人信息
  ['GET', `${routePrefix}/getPersonRank.json`, controllerPath, 'getPersonRank'],
  // 获取打卡排行榜列表
  ['GET', `${routePrefix}/getRankList.json`, controllerPath, 'getRankList'],
];
