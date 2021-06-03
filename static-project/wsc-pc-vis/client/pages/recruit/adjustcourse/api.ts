import { visAjax } from 'fns/new-ajax';

// 获取转出课程详情
export function getTransferOutCourseDetail(queryParams) {
  return visAjax('POST', '/edu/adjustcourse/getTransferOutCourseDetail.json', queryParams);
}

// 转课
export function transferCourse(data) {
  return visAjax('POST', '/edu/adjustcourse/transferCourse.json', data);
}

// 转课凭证
export function getTransferCourseCertificate(data) {
  return visAjax('POST', '/edu/adjustcourse/getTransferCourseCertificate.json', data);
}

// 转出课程学员资产
export function findPageByWithSpecificCourse(data) {
  return visAjax('GET', '/recruit/adjustcourse/findPageByWithSpecificCourse.json', data);
}

