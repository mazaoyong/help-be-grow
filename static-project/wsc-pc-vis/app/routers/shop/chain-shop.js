module.exports = [
  [
    // 根据校区kdtIds批量查询校区店铺基础信息
    'GET',
    '/v4/vis/commom/shop/chain/findListByKdtIds.json',
    'shop.ChainShopQueryController',
    'findListByKdtIds',
  ],
]
;
