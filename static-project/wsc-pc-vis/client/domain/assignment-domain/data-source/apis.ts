import { visAjax } from 'fns/new-ajax';
import { IWorkbookAssignmentListQuery, IHomeworkAssignmentListQuery } from '../types/assignment';

/**
 * 获取作业本下学生作业列表（作业维度）
 * @param {IWorkbookAssignmentListQuery} payload
 */

export function getWorkbookStudentAssignmentList(payload: IWorkbookAssignmentListQuery) {
  return visAjax('GET', '/supv/homework/work/findExerciseAssignmentPage.json', payload, { cleanEmptyString: true });
}

/**
 * 获取作业中的学生作业列表（学生维度）
 * @param {IHomeworkAssignmentListQuery} payload
 */

export function getHomeworkStudentAssignmentList(payload: IHomeworkAssignmentListQuery) {
  return visAjax('GET', '/supv/homework/assignment/findHomeworkAssignmentPage.json', payload, { cleanEmptyString: true });
}
