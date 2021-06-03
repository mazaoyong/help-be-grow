module.exports = [
  ['GET', '/pay/wscvis_ptc_pay', 'trade.order.IndexController', ['setUserPoints', 'getIndexHtml']],
  ['POST', '/pay/wscvis_ptc_pay/confirm.json', 'trade.order.OrderController', 'confirm'],
  ['POST', '/pay/wscvis_ptc_pay/create.json', 'trade.order.OrderController', 'create'],
  ['GET', '/pay/wscvis_ptc_pay/buyerInfo.json', 'trade.order.OrderController', 'buyerInfo'],

  // 支持匿名下单
  ['GET', '/wscvis/knowledge/anonymous/poster', 'trade.order.IndexController', 'getPosterHtml'],
  ['GET', '/wscvis/knowledge/anonymous/course', 'trade.order.IndexController', 'getCourseHtml'],
  [
    'POST',
    '/wscvis/knowledge/anonymous/course/postRewardCourse.json',
    'trade.order.CourseController',
    'postRewardCourseJson',
  ],

  ['POST', '/wscvis/order/confirm.json', 'trade.order.OrderController', 'confirm'],
  ['POST', '/wscvis/order/create.json', 'trade.order.OrderController', 'create'],
  ['GET', '/wscvis/order/hasPay.json', 'trade.order.OrderController', 'hasPay'],

  ['GET', '/wscvis/order/getPaySuccessInfo.json', 'trade.order.OrderController', 'getPaySuccessInfo'],

  // 下单成功页
  ['GET', ['/wscvis/edu/paid-status', '/wscvis/order/paid-status'], 'trade.order.PaidStatusController', 'getIndexHtml'],
  ['GET', '/wscvis/order/getPayStateInfo.json', 'trade.order.PaidStatusController', 'queryPayStateInfo'],
  ['GET', '/wscvis/order/getPayRewardInfo.json', 'trade.order.PaidStatusController', 'queryPayRewardInfo'],
  ['GET', '/wscvis/order/getUmpInfoV2.json', 'trade.order.PaidStatusController', 'getPaySuccessInfoV2'],
  ['GET', '/wscvis/order/getRecommendGoods.json', 'trade.order.PaidStatusController', 'getRecommendGoods'],
  ['GET', '/wscvis/order/getGoodsRecommendInfo.json', 'trade.order.PaidStatusController', 'getGoodsRecommendInfo'],
  ['GET', '/wscvis/order/getInWhiteList.json', 'trade.order.PaidStatusController', 'getInWhiteList'],
  ['GET', '/wscvis/order/getJoinGroupSetting.json', 'trade.order.PaidStatusController', 'getJoinGroupSetting'],
];
