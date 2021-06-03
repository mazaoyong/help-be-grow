import { visAjax } from 'fns/new-ajax';
import { parseContentsAndLives, parseContentList } from './utils';

const columnPrefix = '/course/column';

export function setCourseNotice(params) {
  return visAjax('POST', `${columnPrefix}/courseNotice.json`, params);
}

// 获取专栏内容列表
export async function getContentsAndLives(data) {
  return visAjax('GET', `${columnPrefix}/contentsAndLives.json`, data)
    .then(res => parseContentsAndLives(res));
}

// 获取内容列表
export function getContentLists(data) {
  return visAjax('GET', '/pct/content/list.json', data)
    .then(res => parseContentList(res));
}

// 更新专栏-内容排序值
export async function putContentSort(data) {
  return visAjax('PUT', `${columnPrefix}/contentSort.json`, data);
}

// 专栏添加内容
export function putColumnContent(data) {
  return visAjax('PUT', `${columnPrefix}/content.json`, data);
};

// 专栏添加目录
export function createColumnDir(data) {
  return visAjax('POST', `${columnPrefix}/createDirectory.json`, data);
}

// 专栏移动目录
export function moveColumnDir(data) {
  return visAjax('POST', `${columnPrefix}/moveDirectory.json`, data);
}

// 专栏更新目录
export function updateColumnDir(data) {
  return visAjax('POST', `${columnPrefix}/updateDirectory.json`, data);
}

// 专栏删除目录
export function deleteColumnDir(data) {
  return visAjax('POST', `${columnPrefix}/deleteDirectory.json`, data);
}

// 专栏查询目录列表
export function queryDirectoryList(data) {
  return visAjax('GET', `${columnPrefix}/queryDirectoryList.json`, data);
}

// 批量删除内容
export function batchDeleteContent(data) {
  return visAjax('POST', `${columnPrefix}/batchDeleteContent.json`, data);
}

// 专栏移动目录
export function directoryMoveContent(data) {
  return visAjax('POST', `${columnPrefix}/directoryMoveContent.json`, data);
}

// 专栏添加内容
export function directoryAddContent(data) {
  return visAjax('POST', `${columnPrefix}/directoryAddContent.json`, data);
}

// 批量订阅接口查询
export function findContentSubscriptionCountList(data) {
  return visAjax('GET', `${columnPrefix}/findContentSubscriptionCountList.json`, data);
}
