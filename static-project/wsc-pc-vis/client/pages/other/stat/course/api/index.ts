import ajaxWrap from 'fns/new-ajax/ajax-wrap';

const clueAjax = ajaxWrap(window._global.url.v4 + '/vis/edu/courseStat');

// 报名概览
export function getOverview(data) {
  return clueAjax('GET', '/getOverview.json', data);
}

// 课程收款分布
export function getCoursePaidAmount(data) {
  return clueAjax('GET', '/getCoursePaidAmount.json', data);
}

// 报名学员构成
export function getStudentPaidAmount(data) {
  return clueAjax('GET', '/getStudentPaidAmount.json', data);
}

// 课时销售表
export function findCourseAssetPaidByPage(data) {
  return clueAjax('GET', '/findCourseAssetPaidByPage.json', data);
}

// 课时销售表总计
export function findCourseAssetPaidTotal(data) {
  return clueAjax('GET', '/findCourseAssetPaidTotal.json', data);
}
