module.exports = [
  // 上报性能数据
  ['POST', '/v4/vis/log/perf.json', 'common.LogController', 'logPerf'],
];
