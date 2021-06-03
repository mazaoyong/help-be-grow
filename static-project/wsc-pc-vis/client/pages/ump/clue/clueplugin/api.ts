import { visAjax } from 'fns/new-ajax';

// 初始化线索插件
export function initCluePlugin(payload) {
  return visAjax('POST', '/edu/clue/plugin/init-clue-plugin.json', payload);
}

