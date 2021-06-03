
// 专栏相关接口
import { visAjax } from 'fns/new-ajax';

const columnPrefix = '/course/column';

// 复制专栏
export function copy(data) {
  return visAjax('POST', `${columnPrefix}/copy.json`, data);
}

// 更新专栏显示/隐藏状态
export function updateShowOrHideStatus(data) {
  return visAjax('POST', `${columnPrefix}/updateShowOrHideStatus.json`, data);
}
