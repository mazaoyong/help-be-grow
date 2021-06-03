// 专栏相关接口
import { visAjax } from 'fns/new-ajax';

const columnPrefix = '/course/column';

// 创建专栏
export function createColumn(data) {
  return visAjax('POST', `${columnPrefix}/_textarea_/createColumn.json`, data);
}

// 修改专栏
export function updateColumn(data) {
  return visAjax('POST', `${columnPrefix}/_textarea_/updateColumn.json`, data);
}
