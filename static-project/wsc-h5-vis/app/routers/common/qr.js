const routePrefix = '/wscvis/common/qr';
const controllerPath = 'common.QRController';

module.exports = [
  [
    // 根据 url 生成二维码
    'GET',
    `${routePrefix}/getQrcode.json`,
    controllerPath,
    'getQrcodeJson',
  ],
  [
    // 获取公众号二维码
    'GET',
    `${routePrefix}/getMpQrcode.json`,
    controllerPath,
    'getMpQrcodeJson',
  ],

  /** 创建普通 h5 二维码 */
  [
    'POST',
    `${routePrefix}/h5QrCode.json`,
    controllerPath,
    'createH5QrCode',
  ],
  /** 创建小程序码 */
  [
    'POST',
    `${routePrefix}/weappQrCode.json`,
    controllerPath,
    'createWeappQrCode',
  ],
  /** 创建百度二维码 */
  [
    'POST',
    `${routePrefix}/swanAppQrCode.json`,
    controllerPath,
    'createSwanAppQrCode',
  ],
];
