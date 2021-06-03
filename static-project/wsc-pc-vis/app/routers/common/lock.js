module.exports = [
  [
    // 查询商品锁
    'GET',
    '/v4/vis/lock/types.json',
    'common.ProductLockController',
    'getLockTypes',
  ],
  [
    // 批量查询商品锁
    'POST',
    '/v4/vis/lock/typesGroup.json',
    'common.ProductLockController',
    'listLockTypesGroup',
  ],
];
