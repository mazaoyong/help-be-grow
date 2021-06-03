import ajax from 'zan-pc-ajax';

/**
 * 发送接口请求方法聚合
 * @param {String} path: 请求路径
 * @param {Object} data: 请求参数
 * @param {String} method: 请求类型，默认为`get`
 */
export const makeRequest = <T = any>(path, data = {}, method = 'GET') => {
  const options = {
    method,
    url: path,
    data,
  };
  return ajax<T>(options);
};
