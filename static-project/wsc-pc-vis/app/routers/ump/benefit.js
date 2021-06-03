module.exports = [
  [
    // 页面render
    'GET',
    ['/v4/vis/pct/page/benefit', '/v4/vis/pct/page/benefit/*'],
    'ump.BenefitController',
    ['initVisPage', 'getIndexHtml'],
  ],
  [
    // 获取会员权益列表
    'GET',
    '/v4/vis/pct/benefit/getFindBenefitPackagePage.json',
    'ump.BenefitController',
    'getFindBenefitPackagePageJson',
  ],
  [
    // 创建会员权益
    'POST',
    ['/v4/vis/pct/benefit/postCreateBenefitPackage.json/textarea', '/v4/vis/pct/benefit/_textarea_/postCreateBenefitPackage.json'],
    'ump.BenefitController',
    'postCreateBenefitPackageJson',
  ],
  [
    // 编辑会员权益包
    'POST',
    ['/v4/vis/pct/benefit/postEditBenefitPackage.json/textarea', '/v4/vis/pct/benefit/_textarea_/postEditBenefitPackage.json'],
    'ump.BenefitController',
    'postEditBenefitPackageJson',
  ],
  [
    // 删除会员权益包
    'POST',
    '/v4/vis/pct/benefit/postDeleteBenefitPackage.json',
    'ump.BenefitController',
    'postDeleteBenefitPackageJson',
  ],
  [
    // 检查会员权益包是否存在
    'GET',
    '/v4/vis/pct/benefit/getCheckBenefitPackageStatus.json',
    'ump.BenefitController',
    'getCheckBenefitPackageStatusJson',
  ],
  [
    // 查询会员权益包详情
    'GET',
    '/v4/vis/pct/benefit/getBenefitPackageDetail.json',
    'ump.BenefitController',
    'getBenefitPackageDetailJson',
  ],
  [
    // 查询单个会员权益包
    'POST',
    '/v4/vis/pct/benefit/postEditBenefitItem.json',
    'ump.BenefitController',
    'postEditBenefitItemJson',
  ],
  [
    // 查询权益包项
    'GET',
    '/v4/vis/pct/benefit/getFindBenefitItemDetailPage.json',
    'ump.BenefitController',
    'getFindBenefitItemDetailPageJson',
  ],
  [
    // 添加权益包项
    'POST',
    '/v4/vis/pct/benefit/postAddBenefitItems.json',
    'ump.BenefitController',
    'postAddBenefitItemsJson',
  ],
  [
    // 删除权益包项
    'POST',
    '/v4/vis/pct/benefit/postRemoveBenefitItems.json',
    'ump.BenefitController',
    'postRemoveBenefitItemsJson',
  ],
  [
    // 获取可选的权益卡列表
    'GET',
    '/v4/vis/pct/benefit/getFindSelectableBenefitCardPage.json',
    'ump.BenefitController',
    'getFindSelectableBenefitCardPageJson',
  ],
  [
    // 分页查询可选的权益项列表
    'GET',
    '/v4/vis/pct/benefit/getFindSelectableBenefitItemPage.json',
    'ump.BenefitController',
    'getFindSelectableBenefitItemPageJson',
  ],
  [
    // 分页查询已关联权益卡的权益包
    'GET',
    '/v4/vis/pct/benefit/findAvailableBenefitPackagePage.json',
    'ump.BenefitController',
    'findAvailableBenefitPackagePageJson',
  ],
];
