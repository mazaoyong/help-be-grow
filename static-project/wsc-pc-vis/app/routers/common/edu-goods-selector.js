module.exports = [
  [
    'GET',
    '/v4/vis/edu-goods-selector/goodslist.json',
    'common.EduGoodsSelectorController',
    'fetchGoods',
  ],
  [
    'GET',
    '/v4/vis/edu-goods-selector/edu-goodslist.json',
    'common.EduGoodsSelectorController',
    'getEduGoodsListJson',
  ],
  [
    'GET',
    '/v4/vis/edu-goods-selector/get-config.json',
    'common.EduGoodsSelectorController',
    'getGoodsSelectorConfig',
  ],
  // 商品分组列表（用于筛选框）
  [
    'GET',
    '/v4/vis/edu-goods-selector/filter-groups.json',
    'common.EduGoodsSelectorController',
    'fetchFilterGroups',
  ],
];
