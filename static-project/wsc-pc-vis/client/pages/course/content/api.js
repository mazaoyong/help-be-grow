// @ts-nocheck

import { visAjax } from 'fns/new-ajax';
import * as adapter from './utils/adpater';

// 获取专栏
export function getColumnsSimpleAPI(data) {
  return visAjax('GET', '/course/column/getByAlias.json', data);
}

// 专栏更新提醒
export function postCourseNoticeAPI(data) {
  return visAjax('POST', '/course/column/courseNotice.json', data);
}

// 快捷更改内容名称，价格
export function quickUpdateContentByAlias(data) {
  return visAjax('POST', '/pct/content/quickUpdateContentByAlias.json', data);
}

// 获取内容列表
export const getContentList = adapter.getContentList(function(data) {
  return visAjax('GET', '/pct/content/list.json', data);
});

// 获取内容详情
export const getContentDetail = adapter.getContentDetail(function(alias) {
  return visAjax('GET', '/pct/content/detail.json', { alias });
});

// 新建或更新内容
export const saveContentDetail = adapter.saveContentDetail(function(isUpdate, data) {
  const method = isUpdate ? 'PUT' : 'POST';
  const url = `/pct/content/_textarea_/${isUpdate ? 'update' : 'create'}Content.json`;
  return visAjax(method, url, data);
});

// 内容上下架
export function postContentPublish(data) {
  return visAjax('POST', '/pct/content/publish.json', data);
}

// 专栏内容批量添加
export const postBatchContent = adapter.postBatchContent(function(data) {
  return visAjax(
    'POST',
    '/pct/content/batch.json',
    data,
    {
      rawResponse: true,
    }
  );
});

// 删除内容
export async function deleteContentDetail(data) {
  return visAjax('DELETE', '/pct/content/detail.json', data);
}

// 更新排序值
export async function putSerialNo(data) {
  return visAjax('PUT', '/pct/content/serialNo.json', data);
}
