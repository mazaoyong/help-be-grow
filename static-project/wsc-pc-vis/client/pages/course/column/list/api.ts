// 专栏相关接口
import { visAjax } from 'fns/new-ajax';

const columnPrefix = '/course/column';

// 更新专栏排序值
export function updateSerialNo(data) {
  return visAjax('POST', `${columnPrefix}/updateSerialNo.json`, data);
}

// 快速修改专栏内容，价格
export function quickUpdateColumnByAlias(data) {
  return visAjax('POST', `${columnPrefix}/quickUpdateColumnByAlias.json`, data);
}
