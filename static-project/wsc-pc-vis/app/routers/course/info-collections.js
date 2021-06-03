module.exports = [
  // 根据商品alias获取信息采集设置
  [
    'GET',
    '/v4/vis/course/info-collections/getByAlias.json',
    'course.InfoCollectionsController',
    'getByAliasJSON',
  ],
];
