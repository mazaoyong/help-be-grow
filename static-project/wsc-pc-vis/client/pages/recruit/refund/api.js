import { visAjax } from 'fns/new-ajax';

export function getPreRefundFromOrder(params) {
  return visAjax('GET', '/edu/refund/getPreRefundFromOrder.json', params);
}

export function getPreRefundFromUser(params) {
  return visAjax('GET', '/edu/refund/getPreRefundFromUser.json', params);
}

export function refund(params) {
  return visAjax('POST', '/edu/refund/refund.json', params, {
    rawResponse: true,
  });
}

export function getStaff({ adminId }) {
  return visAjax('GET', '/edu/enrollment/getStaff.json', {
    kdtId: window._global.kdtId,
    adminId,
  });
}

export function findPageStudentLessonByAssetNo(data) {
  return visAjax('GET', '/edu/appointment/findPageStudentLessonByAssetNo.json', data);
}

export function batchCancelV2(data) {
  return visAjax('POST', '/edu/appointment/batchCancelV2.json', data);
}

export function queryAssetRefundPhasePriceInfo(data) {
  return visAjax('GET', '/edu/refund/queryAssetRefundPhasePriceInfo.json', data);
}

export function findBuyGivePresentPageByCondition(data) {
  return visAjax('GET', '/edu/refund/findBuyGivePresentPageByCondition.json', data);
}
