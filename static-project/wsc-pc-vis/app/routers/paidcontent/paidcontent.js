module.exports = [
  [
    // tab 首页
    'GET',
    '/v4/vis/pct/page',
    'paidcontent.PageController',
    ['initPctStatus', 'getIndexHtml'],
  ],

  [
    // 知识付费大单页
    'GET',
    '/v4/vis/pct/page/tabs',
    'paidcontent.TabsController',
    ['initVisPage', 'getIndexHtml'],
  ],

  // setting
  [
    // 设置首页和信息隐藏
    'GET',
    '/v4/vis/pct/page/settings',
    'paidcontent.SettingController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 设置列表
    'GET',
    '/v4/vis/pct/setting/lists.json',
    'paidcontent.SettingController',
    'getListsJson',
  ],
  [
    // 开关设置
    'PUT',
    '/v4/vis/pct/setting/switch.json',
    'paidcontent.SettingController',
    'putSwitchJson',
  ],
];
