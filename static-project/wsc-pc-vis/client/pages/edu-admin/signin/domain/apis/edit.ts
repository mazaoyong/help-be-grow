import { visAjax } from 'fns/new-ajax';

export function getSignInQrCode(params) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', params);
}

export function postSignInSettings(data) {
  return visAjax('POST', '/edu/signin/settings.json', data);
}

export function putSignInSettings(data) {
  return visAjax('PUT', '/edu/signin/settings.json', data);
}

export function getSignInSettings(params) {
  return visAjax('GET', '/edu/signin/settings.json', params);
}

export function getSignInRecords(params) {
  return visAjax('GET', '/edu/signin/records.json', params);
}

export function getActivityCode(params) {
  return visAjax('GET', '/edu/reserve/activityCode.json', params);
}

export function exportRecord(params) {
  return visAjax('POST', '/edu/schedule/detail/exportSignInRecords.json', params);
}

export function findStudents(params) {
  return visAjax('GET', '/edu/student/findStudents.json', params);
}
