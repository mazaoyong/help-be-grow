import pcAjax from 'zan-pc-ajax'; // eslint-disable-line
import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import isUrl from 'zan-utils/validate/url';
import full from 'zan-utils/url/full';

// history back会缓存 get请求加时间戳
const addTimestamp = (obj = {}) => {
  if ((!obj.method || obj.method.toUpperCase() === 'GET') && (!obj.data || !obj.data.t)) {
    obj.data = {
      t: Date.now(),
      ...(obj.data || {}),
    };
  }

  return obj;
};

export default function ajax(url, options = {}) {
  if (isString(url)) {
    if (!isUrl(url)) {
      url = full(url, 'www');
    }

    options = addTimestamp(options);
  } else if (isPlainObject(url) && isString(url.url)) {
    if (!isUrl(url.url)) {
      url.url = full(url.url, 'www');
    }

    url = addTimestamp(url);
  }
  return pcAjax(url, options);
}

ajax.CancelToken = pcAjax.CancelToken;
ajax.isCancel = pcAjax.isCancel;
