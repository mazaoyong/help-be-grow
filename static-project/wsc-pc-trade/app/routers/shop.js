module.exports = [
  ['GET', '/v4/trade/shop/deposit/express.json', 'shop.DepositController', 'getExpressDeposit'],
  ['GET', '/v4/trade/shop/cert/groupcert.json', 'shop.CertController', 'getGroupCertification'],
  ['GET', '/v4/trade/shop/pay/balance.json', 'shop.PayAccountController', 'getAccountBalance'],
  ['GET', '/v4/trade/shop/device/printers.json', 'shop.DeviceController', 'getPrinters'],
];
