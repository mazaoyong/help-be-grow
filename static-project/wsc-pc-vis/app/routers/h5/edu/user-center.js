module.exports = [
  ['GET', '/v4/vis/h5/edu/user-center', 'h5.userCenter.IndexController', 'getIndexHtml'],
  ['GET', '/v4/vis/h5/edu/getTeacherInfoById.json', 'h5.userCenter.IndexController', 'getTeacherInfoById'],
  ['GET', '/v4/vis/h5/edu/getShopInfoByKdtId.json', 'h5.userCenter.IndexController', 'getShopInfoByKdtId'],
  ['POST', '/v4/vis/h5/edu/updateTeacherAvatar.json', 'h5.userCenter.IndexController', 'updateTeacherAvatar'],
];
