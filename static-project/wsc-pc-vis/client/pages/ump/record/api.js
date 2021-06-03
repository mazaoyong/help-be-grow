// 订购记录相关接口
import ajax from 'fns/ajax';

const mapKeysToCamelCase = require('zan-utils/string/mapKeysToCamelCase');

const reqDomain = window._global.url.v4;
// const baseUrl = window._global.isSuperStore ? window._global.url.store : window._global.url.base;

const makeRequest = (method, path, data = {}) => {
  const options = {
    url: `${reqDomain}${path}`,
    method,
    data,
  };
  return ajax(options).then(res => mapKeysToCamelCase(res));
};

// 查询订购记录列表
export function getRecordsLists(data) {
  return makeRequest('GET', '/vis/pct/record/list.json', data);
}

export function exportRecords(data) {
  return makeRequest('POST', '/vis/pct/record/export.json', data);
}

// 导出记录
export function getExportList(data) {
  return makeRequest('GET', '/vis/pct/records/export/list.json', data);
}

// 新的导出记录
export function findPageByCondition(data) {
  return makeRequest('GET', '/vis/pct/records/export/findPageByCondition.json', data);
}

// 获取下载链接
export function getDownLoadUrlById(data) {
  return makeRequest('POST', '/vis/pct/records/export/getDownLoadUrlById.json', data);
}
