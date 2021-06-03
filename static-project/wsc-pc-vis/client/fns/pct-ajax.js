import ajax from 'zan-pc-ajax/lib';

const baseUrl = '/v4/vis/pct';

/**
 * 发起请求
 *
 * @param {string} method 方法
 * @param {string} url 请求地址，前缀为 /v4/vis/pct，只传入后面的就可以
 * @param {Object} [data={}] 参数
 * @param {boolean} [isOther=false] 是否使用别的地址
 * @return {Promise}
 */
const request = (method, url, data = {}, isOther = false, timeout) => {
  if (!isOther) {
    url = baseUrl + url;
  }

  let contentType = 'application/json';
  if (method === 'GET') {
    contentType = 'application/x-www-form-urlencoded';
  }
  return ajax({ method, url, data, contentType, timeout });
};

export default request;
