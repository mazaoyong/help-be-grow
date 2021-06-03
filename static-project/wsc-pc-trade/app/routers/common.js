module.exports = [
  ['url转二维码', 'GET', '/v4/trade/common/qrcode', 'common.CommonController', 'getQrcode'],
  [
    'GET',
    '/v4/trade/shopAddress/defaultAddress.json',
    'refund.RefundsController',
    'getDefaultAddress',
  ],
  [
    'GET',
    '/v4/trade/shopAddress/getCountryCodeList.json',
    'refund.RefundsController',
    'getCountryCodeList',
  ],
  ['POST', '/v4/trade/shopAddress/detail.json', 'refund.RefundsController', 'addShopAddress'],
  ['GET', '/v4/trade/common/getStaffList.json', 'common.CommonController', 'getStaffList'],
  ['GET', '/v4/trade/common/getStaffRoles.json', 'common.CommonController', 'getStaffRoles'],
];
