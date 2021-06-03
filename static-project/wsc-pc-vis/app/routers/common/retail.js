module.exports = [
  [
    // 查询优惠券列表
    'GET',
    '/v4/vis/pct/retail/coupon.json',
    'common.RetailController',
    'getCouponListJson',
  ],
  [
    // 查询优惠券
    'POST',
    '/v4/vis/pct/retail/couponByIds.json',
    'common.RetailController',
    'getCouponJson',
  ],
];
