module.exports = [
  // 奖励页面
  [
    'GET',
    '/wscvis/redirect/weapp',
    'common.RedirectController',
    'getIndexHtml',
  ],
  // iframe 重定向
  [
    'GET',
    '/wscvis/redirect/iframe',
    'common.IframeRedirectController',
    'getIndexHtml',
  ],
];
