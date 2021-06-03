module.exports = [
  ['GET', '/v4/vis/h5/edu/shop-list', 'h5.shop.IndexController', 'getIndexHtml'],
  ['POST', '/v4/vis/h5/edu/getShopList.json', 'h5.shop.IndexController', 'getShopList'],
  ['GET', '/v4/vis/h5/edu/authBeforeEntryShop.json', 'h5.shop.IndexController', 'authBeforeEntryShop'],
  ['GET', '/v4/vis/h5/edu/getStaffPerms.json', 'h5.staff.IndexController', 'getStaffPerms'],
  ['GET', '/v4/vis/h5/edu/findStaffRole.json', 'h5.staff.IndexController', 'findStaffRole'],
  ['GET', '/v4/vis/h5/edu/mult-shop-list', 'h5.shop.IndexController', 'getMultShopListHtml'],
  ['GET', '/v4/vis/h5/edu/searchShopForSwitch.json', 'h5.shop.IndexController', 'searchShopForSwitch'],
  ['GET', '/v4/vis/h5/edu/getShopMetaInfo.json', 'h5.shop.IndexController', 'getShopMetaInfo'],
];
