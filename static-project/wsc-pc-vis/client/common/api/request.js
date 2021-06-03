import ajax from 'zan-pc-ajax/lib';
import { visAjax } from 'fns/new-ajax';

const baseUrl = '/v4/vis';

/**
 * 发起请求(已废弃，不要使用，使用visAjax)
 *
 * @param {string} method 方法
 * @param {string} url 请求地址，前缀为 /v4/vis/pct，只传入后面的就可以
 * @param {Object} [data={}] 参数
 * @param {boolean} [isOther=false] 是否使用别的地址
 * @returns {Promise}
 */
const request = (method, url, data = {}, isOther = false) => {
  if (!isOther) {
    url = baseUrl + url;
  }

  let contentType = 'application/json';
  if (method === 'GET') {
    contentType = 'application/x-www-form-urlencoded';
  }
  return ajax({ method, url, data, contentType });
};

export default request;

// 是否展示百度小程序
export function showBdappCode(data) {
  return visAjax('GET', '/channel/getMpVersion.json', data);
}

// 是否展示百度小程序
export function getBdappCode(data) {
  return visAjax('GET', '/channel/getBaiduAppCode.json', data);
}
