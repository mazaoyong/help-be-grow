module.exports = [
  [
    // 查询商品锁
    'GET',
    '/v4/vis/pct/risk-lock.json',
    'shop.ShopRiskControlReadOuterController',
    'queryShopFuncLock',
  ],
];
