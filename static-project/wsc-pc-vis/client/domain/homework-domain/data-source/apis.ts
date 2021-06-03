import { visAjax } from 'fns/new-ajax';
import type { IHomeworkListQuery, IHomeworkDetailQuery } from '../types/homework';
import type { IHomeworkCreateCommand } from 'definitions/api/owl/pc/HomeworkFacade/createHomework';
import type { IHomeworkUpdateCommand } from 'definitions/api/owl/pc/HomeworkFacade/updateHomework';
import type { IHomeworkDeleteCommand } from 'definitions/api/owl/pc/HomeworkFacade/deleteHomework';

/**
 * 作业本管理 - 获取作业本中作业列表
 * @param {IHomeworkListQuery} payload
 */

export function getWorkbookHomeworkList(payload: IHomeworkListQuery) {
  return visAjax('GET', '/supv/homework/workbook-manage/findPageByCondition.json', payload, { cleanEmptyKey: true });
};

/**
 * 创建作业
 * @param {IHomeworkCreateCommand} payload
 */

export function createHomework(payload: IHomeworkCreateCommand) {
  return visAjax('POST', '/supv/homework/work/createHomework.json', payload, { cleanEmptyString: true });
};

/**
 * 编辑作业
 * @param {IHomeworkUpdateCommand} payload
 */

export function updateHomework(payload: IHomeworkUpdateCommand) {
  return visAjax('PUT', '/supv/homework/work/updateHomework.json', payload, { cleanEmptyString: true });
};

/**
 * 获取作业详情
 * @param {IHomeworkDetailQuery} payload
 */

export function getHomeworkDetail(payload: IHomeworkDetailQuery) {
  return visAjax('GET', '/supv/homework/work/getHomeworkDetail.json', payload);
};

/**
 * 删除作业
 * @param {IHomeworkDeleteCommand} payload
 */

export function deleteHomework(payload: IHomeworkDeleteCommand) {
  return visAjax('DELETE', '/supv/homework/work/deleteHomework.json', payload);
};
