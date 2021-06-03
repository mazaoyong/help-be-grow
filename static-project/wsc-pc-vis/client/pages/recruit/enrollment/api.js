import { visAjax } from 'fns/new-ajax';

export function getPreLinkInfo(params) {
  return visAjax('GET', '/edu/enrollment/getPreLinkInfo.json', params);
}

export function findOfflineCourseWithCondition(params) {
  return visAjax('GET', '/edu/enrollment/findOfflineCourseWithCondition.json', params);
}

export function findOfflineCourseWithConditionV2(params) {
  return visAjax('GET', '/edu/enrollment/findOfflineCourseWithConditionV2.json', params);
}

export function findStudentAndClueInfoByNameOrPhoneNumber(params) {
  return visAjax('GET', '/edu/enrollment/findStudentAndClueInfoByNameOrPhoneNumber.json', params);
}

export function getWscQrcode(params) {
  return visAjax('GET', '/pct/biz/getWscQrcode.json', params);
}

export function submitOfflineEnrollmentOrder(data) {
  return visAjax('POST', '/edu/enrollment/submitOfflineEnrollmentOrder.json', data);
}

export function pay(data) {
  return visAjax('POST', '/edu/enrollment/pay.json', data);
}

export function getPayToolsByEduKdtId() {
  return visAjax('GET', '/edu/enrollment/getPayToolsByEduKdtId.json');
}

export function getClueDetail(params) {
  return visAjax('GET', '/edu/clue/getDetailById.json', params);
}

export function getClueDetailForHide(params) {
  return visAjax('GET', '/edu/clue/getDetailByIdForHide.json', params);
}

export function getStudentDetail(params) {
  return visAjax('GET', '/edu/getInfoByIdForHideJson.json', params);
}

export function getEduClassBySkuIdAndGoodsId(params) {
  return visAjax('GET', '/edu/educlass/getEduClassBySkuIdAndGoodsId.json', params);
}

export function getCourseList(params) {
  return visAjax('GET', '/edu/eduCourse/getEduCourseList.json', params);
}

export function getOrderInfo(params) {
  return visAjax('GET', '/edu/enrollment/getOrderInfo.json', params);
}

export function invisibleOrderById(data) {
  return visAjax('POST', '/edu/enrollment/invisibleOrderById.json', data);
}

export function cancelOrderByNo(data) {
  return visAjax('POST', '/edu/enrollment/cancelOrderByNo.json', data);
}

export function getStudentByNameAndMobile(data) {
  return visAjax('GET', '/edu/enrollment/getStudentByNameAndMobile.json', data);
}

export function linkCourse(data) {
  return visAjax('POST', '/edu/enrollment/linkCourse.json', data, { rawResponse: true });
}

// apollo配置
export function getRemoteConf() {
  return visAjax('GET', '/edu/profile/get-remote-conf.json', {});
}
