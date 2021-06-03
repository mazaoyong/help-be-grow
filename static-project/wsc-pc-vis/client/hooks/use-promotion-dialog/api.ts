import { visAjax } from 'fns/new-ajax';

// 获取推广h5二维码
export function getWapQrCode(data) {
  return visAjax('GET', '/common/shop/getWapQrCode.json', data);
};
