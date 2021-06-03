import { visAjax } from 'fns/new-ajax';

// 获取单个导入任务结果详情
export function getByTaskId(payload) {
  return visAjax('GET', '/edu/studentImport/getByTaskId.json', payload);
}

// 重新导入错误数据
export function prepareReimport(payload) {
  return visAjax('POST', '/edu/studentImport/prepareReimport.json', payload);
}
