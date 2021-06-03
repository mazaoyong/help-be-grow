import { visAjax } from 'fns/new-ajax';
import { IWorkbookStudentListQuery } from '../types/homework-student';

/**
 * 作业本管理 - 查询作业本下面的学员信息列表
 * @param {IWorkbookStudentListQuery} payload
 */

export function getWorkbookStudentList(payload: IWorkbookStudentListQuery) {
  return visAjax('GET', '/supv/homework/workbook-manage/findStudentPageByCondition.json', payload, { cleanEmptyKey: true });
};
