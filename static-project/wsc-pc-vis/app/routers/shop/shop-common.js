// TODO
module.exports = [
  [
    // 查询店铺能力
    'GET',
    '/v4/vis/commom/shop/ability.json',
    'shop.AbilityReadController',
    'getShopAbilityJson',
  ],
  [
    // 店铺任务-完成
    'POST',
    '/v4/vis/commom/shop/finishTask.json',
    'shop.ShopTaskApiController',
    'finishTask',
  ],
  [
    // 获取连锁总部下面所有的子店铺
    'GET',
    '/v4/vis/commom/shop/findListAllCampus.json',
    'shop.ShopQueryController',
    'findListAllCampus',
  ],
  [
    // 查询分店列表-分页
    'GET',
    '/v4/vis/commom/shop/findPageAllCampus.json',
    'shop.ShopQueryController',
    'findPageAllCampus',
  ],
];
