// yzedu 大版本所需api
module.exports = [
  [
    // 查询店铺公测状态
    'GET',
    '/v4/vis/edu/shop/eduShopCreateInfo.json',
    'shop.shop.IndexController',
    'getEduShopCreateInfoJson',
  ],
  [
    // 目录树
    'GET',
    '/v4/vis/edu/shop/eduCategory.json',
    'shop.shop.IndexController',
    'getEduCategoryJson',
  ],
  [
    // 店名校验
    'GET',
    '/v4/vis/edu/shop/checkShopName.json',
    'shop.shop.IndexController',
    'getCheckShopNameJson',
  ],
  [
    // 创建
    'POST',
    '/v4/vis/edu/shop/createEduShop.json',
    'shop.shop.IndexController',
    'postCreateEduShopJson',
  ],
  [
    // 验证码
    'GET',
    '/v4/vis/edu/shop/sendSmsCaptcha.json',
    'shop.shop.IndexController',
    'sendSmsCaptchaJson',
  ],
  [
    // 行为组件接入验证码
    'GET',
    '/v4/vis/edu/shop/sendBehaviorCaptchaJson.json',
    'shop.shop.IndexController',
    'sendBehaviorCaptchaJson',
  ],
  [
    // 升级校验
    'POST',
    '/v4/vis/edu/shop/upgradeToEduShop.json',
    'shop.shop.IndexController',
    'upgradeToEduShopJson',
  ],
  [
    // 查询在售实物列表
    'GET',
    '/v4/vis/edu/shop/getOnSellGoods.json',
    'shop.shop.IndexController',
    'getOnSellGoodsJson',
  ],
  [
    // 查询可升级列表
    'GET',
    '/v4/vis/edu/shop/queryModifiableShops.json',
    'shop.shop.IndexController',
    'queryModifiableShopsJson',
  ],
  [
    // 创建连锁总部
    'POST',
    '/v4/vis/edu/shop/createEduHQ.json',
    'shop.shop.IndexController',
    'createEduHQ',
  ],
  [
    // 查询二维码
    'GET',
    '/v4/vis/edu/shop/getWscQrcode.json',
    'course.PctManageController',
    'getWscQrCode',
  ],
  // ========== 校区管理相关==========
  [
    // 创建校区
    'POST',
    '/v4/vis/edu/chain/createSubShop.json',
    'shop.shop.ChainController',
    'createSubShop',
  ],
  [
    // 编辑校区
    'POST',
    '/v4/vis/edu/chain/updateSubShop.json',
    'shop.shop.ChainController',
    'updateSubShop',
  ],
  [
    // 查询校区信息
    'GET',
    '/v4/vis/edu/chain/querySubShop.json',
    'shop.shop.ChainController',
    'querySubShop',
  ],
  [
    // 查询及搜索有赞教育总部下校区列表
    'GET',
    '/v4/vis/edu/chain/searchDescendentShop.json',
    'shop.shop.ChainController',
    'searchDescendentShop',
  ],
  [
    // 查询有赞教育总部创建校区校验信息
    'GET',
    '/v4/vis/edu/chain/querySubShopCreateCheckInfo.json',
    'shop.shop.ChainController',
    'querySubShopCreateCheckInfo',
  ],

  [
    // 激活校区
    'POST',
    '/v4/vis/edu/chain/activateAppInSubShop.json',
    'shop.shop.ChainController',
    'activateAppInSubShop',
  ],

  [
    // index
    'GET',
    '/v4/vis/edu/shop/index',
    'shop.shop.IndexController',
    'getIndexHtml',
  ],
];
