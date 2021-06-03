// 获取二维码
import ajaxOld from 'captain-ajax';
import { ajax } from '@youzan/vis-ui';

export function getQrCode(data) {
  return ajaxOld({
    url: '/wscvis/knowledge/qrcode.json',
    data,
  });
}

export function getQr(data) {
  return ajax({
    url: '/wscvis/knowledge/qrcode.json',
    data,
  });
}

export function getH5QrCode(data) {

}

export function getWeappCode(data) {

}

export function getSwanQrCode(data) {

}
