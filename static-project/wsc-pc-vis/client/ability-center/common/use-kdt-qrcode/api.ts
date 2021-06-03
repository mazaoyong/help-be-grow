import { visAjax } from 'fns/new-ajax';

// 获取二维码
export function getQrCode({ url, width, height, deleteWhite}) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', { url, width, height, deleteWhite });
}