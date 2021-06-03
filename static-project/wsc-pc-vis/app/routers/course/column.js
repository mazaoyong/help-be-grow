module.exports = [
  [
    // 老列表单页
    'GET',
    '/v4/vis/pct/page/column',
    'course.ColumnController',
    'redirectToNewUrl',
  ],
  [
    // 新列表页
    'GET',
    ['/v4/vis/course/column/list'],
    'course.ColumnController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 新建编辑
    'GET',
    ['/v4/vis/course/column/add', '/v4/vis/course/column/edit/:alias'],
    'course.ColumnController',
    ['initVisPage', 'getEditHtml'],
  ],
  [
    // 专栏管理
    'GET',
    ['/v4/vis/course/column/manage/:alias'],
    'course.ColumnController',
    ['initVisPage', 'getContentHtml'],
  ],
  [
    // 学习记录
    'GET',
    '/v4/vis/course/column/record',
    'course.ColumnController',
    ['initVisPage', 'getRecordHtml'],
  ],
  [
    // 学员详情
    'GET',
    '/v4/vis/course/column/detail',
    'course.ColumnController',
    ['initVisPage', 'getDetailHtml'],
  ],
  [
    // 根据别名查询专栏基本信息
    'GET',
    ['/v4/vis/course/column/base.json', '/v4/vis/pct/column/base.json'],
    'course.ColumnController',
    'getBaseJson',
  ],
  [
    // 课程提醒通知调用接口
    'POST',
    ['/v4/vis/course/column/courseNotice.json', '/v4/vis/pct/column/courseNotice.json'],
    'course.ColumnController',
    'courseNotice',
  ],
  [
    // 快速更新名称，价格
    'POST',
    ['/v4/vis/course/column/quickUpdateColumnByAlias.json', '/v4/vis/pct/column/quickUpdateColumnByAlias.json'],
    'course.ColumnController',
    'quickUpdateColumnByAlias',
  ],
  // 复制专栏商品
  [
    'PUT',
    ['/v4/vis/course/column/duplicateColumn.json', '/v4/vis/pct/column/duplicateColumn.json'],
    'course.ColumnController',
    'putDuplicateColumn',
  ],
  // 获取专栏内容列表
  [
    'GET',
    ['/v4/vis/course/column/contentsAndLives.json', '/v4/vis/pct/column/contentsAndLives.json'],
    'course.ColumnController',
    'getContentsAndLives',
  ],
  // 专栏内容免费 or 取消
  [
    'POST',
    ['/v4/vis/course/column/contentFree.json', '/v4/vis/pct/column/contentFree.json'],
    'course.ColumnController',
    'postContentFree',
  ],
  // 更新专栏内容排序值
  [
    'PUT',
    ['/v4/vis/course/column/contentSort.json', '/v4/vis/pct/column/contentSort.json'],
    'course.ColumnController',
    'putContentSort',
  ],
  // 添加专栏内容
  [
    'PUT',
    ['/v4/vis/course/column/content.json', '/v4/vis/pct/column/content.json'],
    'course.ColumnController',
    'putContent',
  ],
  // 获取专栏订阅数
  [
    'GET',
    ['/v4/vis/course/column/subscriptionCount.json', '/v4/vis/pct/column/subscriptionCount.json'],
    'course.ColumnController',
    'getColumnSubscriptionCount',
  ],
  // #### iron迁移接口
  [
    'POST',
    ['/v4/vis/course/column/updateSerializedStatus.json', '/v4/vis/pct/column/updateSerializedStatus.json'],
    'course.ColumnController',
    'updateSerializedStatus',
  ],
  [
    'POST',
    ['/v4/vis/course/column/updateOnSaleStatus.json', '/v4/vis/pct/column/updateOnSaleStatus.json'],
    'course.ColumnController',
    'updateOnSaleStatus',
  ],
  [
    'POST',
    ['/v4/vis/course/column/_textarea_/createColumn.json', '/v4/vis/pct/column/_textarea_/createColumn.json'],
    'course.ColumnController',
    'createColumn',
  ],
  [
    'POST',
    ['/v4/vis/course/column/_textarea_/updateColumn.json', '/v4/vis/pct/column/_textarea_/updateColumn.json'],
    'course.ColumnController',
    'updateColumn',
  ],
  [
    'POST',
    ['/v4/vis/course/column/deleteColumn.json', '/v4/vis/pct/column/deleteColumn.json'],
    'course.ColumnController',
    'deleteColumn',
  ],
  [
    'GET',
    ['/v4/vis/course/column/findPageByCondition.json', '/v4/vis/pct/column/findPageByCondition.json'],
    'course.ColumnController',
    'findPageByCondition',
  ],
  [
    'GET',
    ['/v4/vis/course/column/getByAlias.json', '/v4/vis/pct/column/getByAlias.json'],
    'course.ColumnController',
    'getByAlias',
  ],
  [
    'POST',
    ['/v4/vis/course/column/updateSerialNo.json', '/v4/vis/pct/column/updateSerialNo.json'],
    'course.ColumnController',
    'updateSerialNo',
  ],
  [
    'POST',
    ['/v4/vis/course/column/updateShowOrHideStatus.json', '/v4/vis/pct/column/updateShowOrHideStatus.json'],
    'course.ColumnController',
    'updateShowOrHideStatus',
  ],
  [
    'POST',
    ['/v4/vis/course/column/updateShareStatus.json', '/v4/vis/pct/column/updateShareStatus.json'],
    'course.ColumnController',
    'updateShareStatus',
  ],
  [
    'POST',
    ['/v4/vis/course/column/copy.json', '/v4/vis/pct/column/copy.json'],
    'course.ColumnController',
    'copy',
  ],
  [
    'GET',
    '/v4/vis/course/column/getList.json',
    'course.ColumnController',
    'findPageByConditionNew',
  ],
  // ### iron接口迁移
  // 教育专栏|知识付费专栏忽略单个消息
  [
    'POST',
    ['/v4/vis/course/column/updateOverLookSingleColumn.json', '/v4/vis/pct/column/updateOverLookSingleColumn.json'],
    'course.ColumnController',
    'updateOverLookSingleColumn',
  ],
  // 知识付费->专栏列表->忽略全部消息
  [
    'POST',
    '/v4/vis/pct/column/updateOverLookAllColumns.json',
    'course.ColumnController',
    'updateOverLookAllColumns',
  ],
  // 知识付费->统计有异常信息的专栏的数量
  [
    'GET',
    '/v4/vis/pct/column/getColumnWarningCount.json',
    'course.ColumnController',
    'getColumnWarningCount',
  ],
  // 创建专栏目录
  [
    'POST',
    '/v4/vis/course/column/createDirectory.json',
    'course.ColumnController',
    'createDirectory',
  ],
  // 更新专栏目录
  [
    'POST',
    '/v4/vis/course/column/updateDirectory.json',
    'course.ColumnController',
    'updateDirectory',
  ],
  // 删除专栏目录
  [
    'POST',
    '/v4/vis/course/column/deleteDirectory.json',
    'course.ColumnController',
    'deleteDirectory',
  ],
  // 移动专栏目录
  [
    'POST',
    '/v4/vis/course/column/moveDirectory.json',
    'course.ColumnController',
    'moveDirectory',
  ],
  // 查询目录列表
  [
    'GET',
    '/v4/vis/course/column/queryDirectoryList.json',
    'course.ColumnController',
    'queryDirectoryList',
  ],
  // 移动专栏内容
  [
    'POST',
    '/v4/vis/course/column/directoryMoveContent.json',
    'course.ColumnController',
    'directoryMoveContent',
  ],
  // 专栏添加内容
  [
    'POST',
    '/v4/vis/course/column/directoryAddContent.json',
    'course.ColumnController',
    'directoryAddContent',
  ],
  // 批量删除内容
  [
    'POST',
    '/v4/vis/course/column/batchDeleteContent.json',
    'course.ColumnController',
    'batchDeleteContent',
  ],
  // 批量查询订阅接口
  [
    'GET',
    '/v4/vis/course/column/findContentSubscriptionCountList.json',
    'course.ColumnController',
    'findContentSubscriptionCountList',
  ]
];
