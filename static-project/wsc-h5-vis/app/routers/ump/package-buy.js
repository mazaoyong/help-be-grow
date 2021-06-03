module.exports = [
  [
    // 优惠套餐活动页
    'GET',
    '/wscvis/ump/package-buy',
    'ump.RenderController',
    'renderPackageBuyHtml',
  ],
  [
    // 获取套餐活动信息
    'GET',
    '/wscvis/ump/listActivityDetail.json',
    'ump.ActivityController',
    'listActivityDetailJson',
  ],
  [
    // 获取商品sku
    'GET',
    '/wscvis/ump/getGoodsAllSku.json',
    'ump.ActivityController',
    'getGoodsAllSkuJson',
  ],
];
