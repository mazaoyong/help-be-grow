export = [
  // 商品页下单用的缓存接口
  [
    'POST',
    '/wscvis/trade/bookKey.json',
    'trade.TradeBizController',
    'postCacheJson',
  ],
  // 商品页0元单时用的购买接口
  [
    'POST',
    '/wscvis/trade/create.json',
    'trade.TradeBuyController',
    'postCreateJson',
  ],
];
