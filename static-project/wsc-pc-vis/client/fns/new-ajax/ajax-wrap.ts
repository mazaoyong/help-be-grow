import ajax from './ajax';
import type { IAjaxOptions } from './ajax';

type Methods = 'GET' | 'get' | 'POST' | 'post' | 'PUT' | 'put' | 'DELETE' | 'delete';
/**
 * ajax 高阶函数封装
 * @param {string} prefix 请求前缀
 */
export default function ajaxWrap(prefix: string) {
  return <T = any>(method: Methods, url: string, data?: Record<string, any>, options?: IAjaxOptions) => {
    url = prefix + url;
    url.replace('//', '/');
    return ajax<{
      pageable: {
        pageSize: number;
        pageNumber: number;
        [key: string]: any;
      };
      total: number;
    } & T>(method, url, data || {}, options || {});
  };
}
