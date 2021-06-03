import ajax from 'zan-pc-ajax/lib';

const baseUrl = '';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS';
type IsOther = false | true;

/**
 * 发起请求
 *
 * @param {Method} method 方法
 * @param {string} url 请求地址，前缀为 /v4/vis/reserve，只传入后面的就可以
 * @param {object} [data={}] 参数
 * @param {boolean} [isOther=false] 是否使用别的地址
 * @returns {Promise}
 */
const request = (
  method: Method,
  url: string,
  data: object = {},
  isOther: IsOther = false,
): Promise<any> => {
  const contentType: string = 'application/json';
  // if (method === 'GET') {
  //   contentType = 'application/x-www-form-urlencoded';
  // }
  if (!isOther) {
    return ajax({ method, url: baseUrl + url, data, contentType });
  }
  return ajax({ method, url, data, contentType });
};

export default request;
