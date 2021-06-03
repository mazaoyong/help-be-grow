import { visAjax } from 'fns/new-ajax';

// 创建导入任务
export function createImportTask(payload) {
  return visAjax('POST', '/edu/studentImport/create.json', payload);
}

// 导入前数据校验
export function prepareImport(payload) {
  return visAjax('POST', '/edu/studentImport/prepareImport.json', payload);
}

// 开始导入
export function submitImport(payload) {
  return visAjax('POST', '/edu/studentImport/submitImport.json', payload);
}

// 获取导入、校验任务进度
export function findTaskProgress(payload) {
  return visAjax('GET', '/edu/studentImport/findTaskProgress.json', payload);
}
