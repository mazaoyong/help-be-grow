module.exports = [
  ['GET', '/wscvis/getWeappConfig.json', 'base.BaseController', 'getWeappConfigJson'],
  ['INDEX_PAGE', 'GET', ['/', '/index'], 'knowledge.IndexController', 'getIndexHtml'],
];
