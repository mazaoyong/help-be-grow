module.exports = [
  [
    // 页面render
    'GET',
    '/v4/vis/pct/page/content',
    'course.ContentController',
    ['initVisPage', 'getIndexHtml'],
  ],
  // 获取内容列表
  ['GET', '/v4/vis/pct/content/list.json', 'course.ContentController', 'getContentList'],
  // 获取wym编辑用内容列表
  ['GET', '/v4/vis/course/content/findPageByConditionWym.json', 'course.ContentController', 'findPageByConditionWym'],
  // 获取内容详情
  ['GET', '/v4/vis/pct/content/detail.json', 'course.ContentController', 'getContentDetail'],
  // 新建内容
  ['POST', '/v4/vis/pct/content/_textarea_/createContent.json', 'course.ContentController', 'postContentDetail'],
  // 更新内容
  ['PUT', '/v4/vis/pct/content/_textarea_/updateContent.json', 'course.ContentController', 'putContentDetail'],
  // 删除内容
  ['DELETE', '/v4/vis/pct/content/detail.json', 'course.ContentController', 'deleteContentDetail'],
  // 复制内容商品
  ['PUT', '/v4/vis/pct/content/duplicateContent.json', 'course.ContentController', 'putDuplicateContent'],
  // 上下架
  ['POST', '/v4/vis/pct/content/publish.json', 'course.ContentController', 'postContentPublish'],
  // 批量新建内容
  ['POST', '/v4/vis/pct/content/batch.json', 'course.ContentController', 'postBatchContent'],
  // 更新排序值
  ['PUT', '/v4/vis/pct/content/serialNo.json', 'course.ContentController', 'updateSerialNo'],
  [
    // 快速更新名称，价格
    'POST',
    '/v4/vis/pct/content/quickUpdateContentByAlias.json',
    'course.ContentController',
    'quickUpdateContentByAlias',
  ],

  // 获取内容订阅数
  [
    'GET',
    '/v4/vis/pct/content/subscriptionCount.json',
    'course.ContentController',
    'getContentSubscriptionCount',
  ],
];
