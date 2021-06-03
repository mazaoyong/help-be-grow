import { visAjax } from 'fns/new-ajax';

export function getQrcode(qrCodeDTO) {
  return visAjax('GET', '/edu/enrollment/getQrcode.json', qrCodeDTO);
};

export function getReceiptV2(orderNo) {
  return visAjax('GET', '/edu/enrollment/getReceiptV2.json', { orderNo });
};
