// 设置相关接口
import request from 'fns/pct-ajax';
// 老接口
import ajax from 'fns/ajax';
const mapKeysToCamelCase = require('zan-utils/string/mapKeysToCamelCase');

// 设置列表
export function getSettingList(data) {
  return request('GET', '/setting/lists.json', data);
}

// 开关
export function settingItem(data) {
  return request('PUT', '/setting/switch.json', data);
}

// 信息隐藏
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

// 批量获取店铺指定开关可见性配置
export function getBatchVisibility(data) {
  return makeRequest('GET', '/vis/pct/hideInfo/batchVisibility.json', data);
}

// 全局店铺设置「首次」
export function createKdtVisibility(data) {
  return makeRequest('POST', '/vis/pct/hideInfo/kdtVisibilityOne.json', data);
}

// 切换店铺可见性开关
export function putKdtVisibility(data) {
  return makeRequest('PUT', '/vis/pct/hideInfo/kdtVisibility.json', data);
}
