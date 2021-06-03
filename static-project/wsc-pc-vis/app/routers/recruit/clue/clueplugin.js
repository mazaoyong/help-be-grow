module.exports = [
  [
    // 初始化线索插件
    'POST',
    '/v4/vis/edu/clue/plugin/init-clue-plugin.json',
    'recruit.clue.CluePluginController',
    'initCluePlugin',
  ],
];
