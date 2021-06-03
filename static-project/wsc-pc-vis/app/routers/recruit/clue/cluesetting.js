module.exports = [
  [
    // 线索设置
    'GET',
    '/v4/vis/edu/page/clue/setting',
    'recruit.clue.ClueSettingController',
    'getIndexHTML',
  ],
  [
    // 获取线索设置
    'GET',
    '/v4/vis/edu/clue/setting/getClueSetting.json',
    'recruit.clue.ClueSettingController',
    'getClueSettingJson',
  ],
  [
    // 保存线索设置
    'POST',
    '/v4/vis/edu/clue/setting/updateClueSetting.json',
    'recruit.clue.ClueSettingController',
    'updateClueSettingJson',
  ],
];
