/**
 * 以下router接口为下单页专用！！！
 */
export = [
  // 下单页
  ['GET', '/pay/wscvis_buy', 'trade.TradeBuyController', ['buyAcl', 'getIndexHtml']],
  // 预下单
  ['POST', '/pay/wscvis_buy/confirm.json', 'trade.TradeBuyController', 'postConfirmJson'],
  // 下单
  ['POST', '/pay/wscvis_buy/create.json', 'trade.TradeBuyController', 'postCreateJson'],
  // 获取下单页信息
  ['GET', '/pay/wscvis_buy/info.json', 'trade.TradeBuyController', 'getTradeOrderJson'],
];
