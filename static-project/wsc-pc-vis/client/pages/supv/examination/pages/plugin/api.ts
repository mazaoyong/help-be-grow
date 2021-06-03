import { visAjax } from 'fns/new-ajax';

// 初始化考试插件
export function initExamPlugin(payload) {
  return visAjax('GET', '/supv/examination/initExamPlugin.json', payload);
}
