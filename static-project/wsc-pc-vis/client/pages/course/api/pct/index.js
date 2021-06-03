// 知识付费公共相关接口
import { visAjax } from 'fns/new-ajax';

// iron迁移新接口
export function ignoreWarningV2(data) {
  return visAjax('POST', '/course/column/updateOverLookSingleColumn.json', data);
}
