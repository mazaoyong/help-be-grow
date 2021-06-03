import { visAjax } from 'fns/new-ajax';

export function getCertificateQrCode(params) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', params);
}

export function findCertificateTemplate(data) {
  return visAjax('GET', '/edu/certificate/findCertificateTemplate.json', data);
}

export function getCertificateTemplate(data) {
  return visAjax('GET', '/edu/certificate/getCertificateTemplate.json', data);
}

export function createCertificateTemplate(data) {
  return visAjax('POST', '/edu/certificate/createCertificateTemplate.json', data);
}

export function updateCertificateTemplate(data) {
  return visAjax('POST', '/edu/certificate/updateCertificateTemplate.json', data);
}

export function deleteCertificateTemplate(data) {
  return visAjax('POST', '/edu/certificate/deleteCertificateTemplate.json', data);
}

export function findCertificate(data) {
  return visAjax('GET', '/edu/certificate/findCertificate.json', data);
}

export function findOwlProductJson(data) {
  return visAjax('GET', '/edu/certificate/findOwlProduct.json', data);
}

export function invalidCertificateTemplate(data) {
  return visAjax('POST', '/edu/certificate/invalidCertificateTemplate.json', data);
}

export function getCourseDetail(data) {
  return visAjax('GET', '/edu/course/getCoursePCDetail.json', data);
}
