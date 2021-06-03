import { visAjax } from 'fns/new-ajax';

// 出勤概览
export function getConsumeClassOverview(data) {
  return visAjax('GET', '/stat/consume/getConsumeClassOverview.json', data);
}

// 上课明细
export function findConsumeClassDetailPage(data) {
  return visAjax('GET', '/stat/consume/findConsumeClassDetailPage.json', data);
}

// 导出上课明细
export function exportConsumeClassDetail(data) {
  return visAjax('POST', '/stat/consume/exportConsumeClassDetail.json', data);
}
