import ajax from 'zan-pc-ajax';
import { BASE_URL } from '../constants';

export const ajaxVis = ajaxWrap(BASE_URL + '/vis');

export function ajaxWrap(prefix: string) {
  return <T>(method: string, url: string, data: any) => {
    url = prefix + url;
    return ajax<T>(url, {
      method,
      data,
    });
  };
}
