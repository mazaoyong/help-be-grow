module.exports = [
  [
    // 邀请卡页面
    'GET',
    '/wscvis/ump/invite-card',
    'ump.InviteController',
    'getIndexHtml',
  ],

  [
    // 获取分销员信息
    'GET',
    '/wscvis/ump/getShareIcon.json',
    'knowledge.SalesmanController',
    'getShareIconJson',
  ],

  // 海报相关，目前用在小程序端
  ['GET', '/wscvis/ump/invite/getInvitePoster.json', 'ump.PosterController', 'getInvitePoster'],

  [
    // 专用于分销员海报也查询商品信息
    'GET',
    '/wscvis/ump/invite-card/getDistributorDetail.json',
    'ump.InviteController',
    'getDistributorDetail',
  ],
];
