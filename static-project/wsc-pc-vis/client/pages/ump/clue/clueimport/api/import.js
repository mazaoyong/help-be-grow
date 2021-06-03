import { visAjax } from 'fns/new-ajax';

// 创建导入任务
export function createImportTask(payload) {
  return visAjax('POST', '/edu/clue/import/createImportTask.json', payload);
}

// 获取导入模板文件
export function getImportTempFile() {
  return visAjax('POST', '/edu/clue/import/getImporTemp.json', {});
}
