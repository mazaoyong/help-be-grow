export = [
  // 领取优惠券
  [
    'GET',
    '/wscvis/ump/goods/receiveCoupon.json',
    'ump.GoodsController',
    'receiveCouponJson',
  ],
  [
    'GET',
    '/wscvis/ump/goods/getCouponList.json',
    'ump.GoodsController',
    'getCouponList',
  ],
];
