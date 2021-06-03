const routePrefix = '/wscvis/common/poster';
const controllerPath = 'common.PosterController';

module.exports = [
  // 生成海报
  [
    'POST',
    `${routePrefix}/getVuePoster.json`,
    controllerPath,
    'getVuePoster',
  ],
  [
    'GET',
    `${routePrefix}/testVuePoster`,
    controllerPath,
    'testVuePoster',
  ],
];
