/**
* 收益页面相关接口
*/

module.exports = [
  ['GET', '/wscvis/knowledge/profitInfo.json', 'knowledge.ProfitController', 'getProfitInfoJson'],
  ['GET', '/wscvis/knowledge/profitDetail.json', 'knowledge.ProfitController', 'getProfitDetailJson'],

  ['GET', '/wscvis/knowledge/index', 'knowledge.IndexController', ['setUserPoints', 'getIndexHtml']],
];
