import { visAjax } from 'fns/new-ajax';

// 获取推广h5二维码
export function getWapQrCode(data) {
  return visAjax('GET', '/ump/tuition-offset/getWapQrCode.json', data);
};

// 查看活动详情
export function getTuitionOffsetDetailById(data) {
  return visAjax('GET', '/ump/tuition-offset/edit/getDetailById.json', data);
}
