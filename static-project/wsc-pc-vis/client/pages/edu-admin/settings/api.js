import { visAjax } from 'fns/new-ajax';

export function createEduConfig(data) {
  return visAjax('POST', '/edu/settings.json', data);
}

export function updateEduConfig(data) {
  return visAjax('PUT', '/edu/settings.json', data);
}

export function getEduConfig() {
  return visAjax('GET', '/edu/settings.json');
}

export function getAppointmentConfig() {
  return visAjax('GET', '/edu/getAppointmentConfig.json');
}

export function updateAppointmentConfig(data) {
  return visAjax('POST', '/edu/updateAppointmentConfig.json', data);
}

export function isShopAppointmentConfigIndependent() {
  return visAjax('GET', '/edu/isShopAppointmentConfigIndependent.json');
}

// 获取课节看版
export function getScheduleListAPI(data) {
  return visAjax('GET', '/edu/schedule/list.json', data);
}
