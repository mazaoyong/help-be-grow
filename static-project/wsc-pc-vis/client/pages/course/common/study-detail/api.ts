
import { visAjax } from 'fns/new-ajax';

// 分页查询个人学习明细
export function findUserLearnDetail(data) {
  return visAjax('GET', '/course/online-course/findUserLearnDetail.json', data);
}

// 查询个人学习数据统计
export function getUserOverview(data) {
  return visAjax('GET', '/course/online-course/getUserOverview.json', data);
}
