import { visAjax } from 'fns/new-ajax';

// 出勤概览
export function getAttendanceOverview(data) {
  return visAjax('GET', '/stat/attendance/getAttendanceOverview.json', data);
}

// 上课明细
export function findAttendClassDetailPage(data) {
  return visAjax('GET', '/stat/attendance/findAttendClassDetailPage.json', data);
}

// 导出上课明细
export function exportAttendClassDetail(data) {
  return visAjax('POST', '/stat/attendance/exportAttendClassDetail.json', data);
}
