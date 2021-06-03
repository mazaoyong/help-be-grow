// 好友助力页面
module.exports = [
  ['GET', '/wscvis/ump/collect-zan', 'ump.CollectZanController', 'getIndexHtml'],
  ['GET', '/wscvis/ump/collect-zan/buildZanSet.json', 'ump.CollectZanController', 'getBuildZanSetJson'],
  ['GET', '/wscvis/ump/collect-zan/zanSetDetail.json', 'ump.CollectZanController', 'getZanSetDetailJson'],
  ['GET', '/wscvis/ump/collect-zan/givingZan.json', 'ump.CollectZanController', 'getGivingZanJson'],
];
