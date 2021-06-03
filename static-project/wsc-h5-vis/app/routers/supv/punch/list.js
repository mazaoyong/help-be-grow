/**
 * 打卡区接口
 */
const routePrefix = '/wscvis/supv/punch/list';
const controllerPath = 'supv.punch.ListController';

module.exports = [
  ['GET', `${routePrefix}`, 'supv.punch.RenderController', 'renderList'],
  ['GET', `${routePrefix}/getAllPunchList.json`, `${controllerPath}`, 'getAllPunchList'],
];
