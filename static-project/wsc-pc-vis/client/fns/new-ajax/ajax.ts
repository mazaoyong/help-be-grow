// 通用 ajax 方法
import pcAjax from 'zan-pc-ajax';
import full from 'zan-utils/url/full';
import isUrl from 'zan-utils/validate/url';

export interface IAjaxOptions extends Record<string, any> {
  // 是否把null undefined params 干掉
  cleanEmptyKey?: boolean;
  // 是否把空字符串干掉
  cleanEmptyString?: boolean;
}

export type ajaxPromise<T> = (
  method: string,
  url: string,
  data: { [key: string]: any },
  options?: IAjaxOptions,
) => Promise<T>;

/**
 * 通用 ajax 请求方法
 *
 * @param {string} method 方法
 * @param {string} url 请求地址
 * @param {Object} [data={}] 参数
 * @return {Promise<any>}
 */
function ajax<T = any>(
  method: string,
  url: string,
  data = {},
  options: IAjaxOptions = {},
): Promise<T> {
  if (isUrl(url) === false) {
    url = full(url, 'base');
  }

  const contentType = 'application/json';

  const parmas = Object.assign({}, { method, url, data, contentType }, options);

  // history back会缓存 get请求加时间戳
  if (
    (!parmas.method || parmas.method.toUpperCase() === 'GET') &&
    // @ts-ignore
    (!parmas.data || !parmas.data.t)
  ) {
    parmas.data = {
      t: Date.now(),
      ...(parmas.data || {}),
    };
  }

  // 清理empty key
  if (options.cleanEmptyKey && typeof data === 'object') {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') removeEmpty(obj[key]);
        else if (obj[key] === null || typeof obj[key] === 'undefined') delete obj[key];
      });
    };
    removeEmpty(parmas.data);
  }

  // 清理空字符串和empty key
  if (options.cleanEmptyString && typeof data === 'object') {
    const removeEmpty = (obj: any) => {
      Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === 'object') {
          removeEmpty(obj[key]);
        } else if (obj[key] === '' || obj[key] == null) {
          delete obj[key];
        }
      });
    };
    removeEmpty(parmas.data);
  }

  return pcAjax(parmas);
}

ajax.CancelToken = pcAjax.CancelToken;
ajax.isCancel = pcAjax.isCancel;

export default ajax;
