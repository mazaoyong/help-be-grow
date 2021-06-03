
// 专栏相关接口
import { visAjax } from 'fns/new-ajax';

// 删除内容
export async function deleteContentDetail(data) {
  return visAjax('DELETE', '/pct/content/detail.json', data);
}

// 设置内容免费 or 取消免费
export function postContentFree(data) {
  return visAjax('POST', '/course/column/contentFree.json', data);
}
