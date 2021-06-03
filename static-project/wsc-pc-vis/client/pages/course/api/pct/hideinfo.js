// 信息隐藏相关接口
import ajax from 'fns/ajax';

const mapKeysToCamelCase = require('zan-utils/string/mapKeysToCamelCase');

const reqDomain = window._global.url.v4;

const makeRequest = (method, path, data = {}) => {
  const options = {
    url: `${reqDomain}${path}`,
    method,
    data,
  };
  return ajax(options).then(res => mapKeysToCamelCase(res));
};

// 获取店铺指定开关可见性配置
export function getVisibility(data) {
  return makeRequest('GET', '/vis/pct/hideInfo/visibility.json', data);
}

// 全局店铺设置「首次」
export function createKdtVisibility(data) {
  return makeRequest('POST', '/vis/pct/hideInfo/kdtVisibilityOne.json', data);
}

// 切换店铺可见性开关
export function putKdtVisibility(data) {
  return makeRequest('PUT', '/vis/pct/hideInfo/kdtVisibility.json', data);
}

// 获取直播所有可见性配置
export function getVisibilityConfigForLive(data) {
  return makeRequest('GET', '/vis/pct/hideInfo/visibilityConfigForLive.json', data);
}

// 单商品可见性设置「首次」
export function createSingleVisibilityConfig(data) {
  return makeRequest('POST', '/vis/pct/hideInfo/singleVisibilityConfig.json', data);
}

// 单商品可见性切换「单个商品」
export function putSingleVisibilityConfig(data) {
  return makeRequest('PUT', '/vis/pct/hideInfo/singleVisibilityConfig.json', data);
}
