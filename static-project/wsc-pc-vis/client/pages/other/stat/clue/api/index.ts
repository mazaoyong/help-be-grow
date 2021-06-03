import ajaxWrap from 'fns/new-ajax/ajax-wrap';

const clueAjax = ajaxWrap(window._global.url.v4 + '/vis/edu/clueStat');

// 线索概览
export function getOverview(data) {
  return clueAjax('GET', '/getOverview.json', data);
}

// 线索来源分析
export function getSourceAnalyse(data) {
  return clueAjax('GET', '/getSourceAnalyse.json', data);
}

// 线索转化分析
export function getCVRAnalyse(data) {
  return clueAjax('GET', '/getCVRAnalyse.json', data);
}
