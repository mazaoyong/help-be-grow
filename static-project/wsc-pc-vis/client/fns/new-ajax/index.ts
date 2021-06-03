import ajaxWrap from './ajax-wrap';

export * from './ajax';

// 请求 wsc-pc-vis 的接口用这个方法，会自动补齐 domain/v4/vis
export const visAjax = ajaxWrap(window._global.url.v4 + '/vis');
export const v4Ajax = ajaxWrap(window._global.url.v4);
// 请求 wsc-node 的接口用这个方法，会自动补齐 domain/v3
export const wscAjax = ajaxWrap(window._global.url.wsc);
// 请求 iron 的接口用这个方法，会自动补齐 domain/v2
export const ironAjax = ajaxWrap(window._global.url.www);
