import { visAjax } from 'fns/new-ajax';

// 分页查询店铺客户信息
export function getCustomerList(data) {
  return visAjax('GET', '/ump/exam/getCustomerList.json', data);
}

// 分页查询学习明细
export function findDetail(data) {
  return visAjax('GET', '/course/online-course/findDetail.json', data);
}

// 查询数据统计
export function getOverview(data) {
  return visAjax('GET', '/course/online-course/getOverview.json', data);
}

// 查询数据趋势
export function getTrend(data) {
  return visAjax('GET', '/course/online-course/getTrend.json', data);
}

// 数据导出
export function exportTask(data) {
  return visAjax('GET', '/course/online-course/exportTask.json', data);
}
