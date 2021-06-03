module.exports = [
  [
    // 获取店铺指定开发可见性配置
    'GET',
    '/v4/vis/pct/hideInfo/visibility.json',
    'course.HideInfoController',
    'getVisibilityJson',
  ],
  [
    // 批量获取店铺指定开发可见性配置
    'GET',
    '/v4/vis/pct/hideInfo/batchVisibility.json',
    'course.HideInfoController',
    'getBatchVisibilityJson',
  ],
  [
    // 全局店铺设置(首次)
    'POST',
    '/v4/vis/pct/hideInfo/kdtVisibilityOne.json',
    'course.HideInfoController',
    'postKdtVisibilityOneJson',
  ],
  [
    // 切换店铺可见性开关
    'PUT',
    '/v4/vis/pct/hideInfo/kdtVisibility.json',
    'course.HideInfoController',
    'putKdtVisibilityJson',
  ],
  [
    // 获取直播所有可见性配置
    'GET',
    '/v4/vis/pct/hideInfo/visibilityConfigForLive.json',
    'course.HideInfoController',
    'getVisibilityConfigForLiveJson',
  ],
  [
    // 单商品可见性设置「首次」
    'POST',
    '/v4/vis/pct/hideInfo/singleVisibilityConfig.json',
    'course.HideInfoController',
    'postSingleVisibilityConfigJson',
  ],
  [
    // 单商品可见性切换「单个商品」
    'PUT',
    '/v4/vis/pct/hideInfo/singleVisibilityConfig.json',
    'course.HideInfoController',
    'putSingleVisibilityConfigJson',
  ],
];
