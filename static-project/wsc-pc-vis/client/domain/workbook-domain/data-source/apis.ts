import { visAjax } from 'fns/new-ajax';
import type { IWorkbookListQuery, IWorkbookDetailQuery, IWorkbookSummaryQuery } from '../types';
import type { IPageRequest } from 'definitions/api/owl/pc/ExerciseBookFacade/findClassPageByCondition';
import type { IExerciseBookUpdateStatusCommand } from 'definitions/api/owl/pc/ExerciseBookFacade/takeUpExerciseBook';
import type { IExerciseBookDeleteCommand } from 'definitions/api/owl/pc/ExerciseBookFacade/deleteExerciseBook';
import type { IExerciseBookCreateCommand } from 'definitions/api/owl/pc/ExerciseBookFacade/createExerciseBook';
import type { IExerciseBookUpdateCommand } from 'definitions/api/owl/pc/ExerciseBookFacade/updateExerciseBook';
import type { IExerciseStudentPageQuery } from 'definitions/api/owl/pc/ExerciseBookStatisticsFacade/exportStudent';
import type { IExerciseReward, IKdtId } from 'definitions/api/owl/pc/ExerciseRewardFacade/exerciseReward';
/**
 * 分页查询作业本列表
 * @param {IWorkbookListQuery} payload
 */

export function getWorkbookList(payload: IWorkbookListQuery) {
  return visAjax('GET', '/supv/homework/book/findPageByCondition.json', payload, {
    cleanEmptyKey: true,
  });
}

/**
 * 作业本上下架
 * @param {IExerciseBookUpdateStatusCommand} payload
 */

export function toggleWorkbookStockStatus(payload: IExerciseBookUpdateStatusCommand) {
  return visAjax('POST', '/supv/homework/book/updateExerciseBookSoldStatus.json', payload);
}

/**
 * 作业本删除
 * @param {IExerciseBookDeleteCommand} payload
 */

export function deleteWorkbook(payload: IExerciseBookDeleteCommand) {
  return visAjax('DELETE', '/supv/homework/book/deleteWorkbook.json', payload);
}

/**
 * 创建作业本
 * @param {IExerciseBookCreateCommand} payload
 */

export function createWorkbook(payload: IExerciseBookCreateCommand) {
  return visAjax('POST', '/supv/homework/book/createExerciseBook.json', payload);
}

/**
 * 更新作业本内容
 * @param {IExerciseBookUpdateCommand} payload
 */

export function updateWorkbook(payload: IExerciseBookUpdateCommand) {
  return visAjax('PUT', '/supv/homework/book/updateExerciseBook.json', payload);
}

/**
 * 获取作业本详情
 * @param {IWorkbookDetailQuery} payload
 */

export function getWorkbookDetail(payload: IWorkbookDetailQuery) {
  return visAjax('GET', '/supv/homework/book/getExerciseBookDetail.json', payload);
}

/**
 * 获取作业本概览数据
 * @param {IWorkbookSummaryQuery} payload
 */

export function getWorkbookSummary(payload: IWorkbookSummaryQuery) {
  return visAjax('GET', '/supv/homework/book/getExerciseBookOverview.json', payload);
}

/** 模糊查询班级列表
 * @param {Query} eduClassName
 * @param {IPageRequest} pageRequest
 */

export function getEduClassList(payload: {
  query: { eduClassName: string };
  pageRequest: IPageRequest;
}) {
  return visAjax('GET', '/supv/homework/book/findClassPageByCondition.json', payload);
}

/**
 * 获取班级关联的作业本列表
 * @param query
 * @param {IPageRequest} pageRequest
 */

export function getEduClassWorkbookList(payload: {
  query: { classId: number; targetKdtId?: number };
  pageRequest: IPageRequest;
}) {
  return visAjax('GET', '/supv/homework/book/findExerciseRelClassPage.json', payload, {
    cleanEmptyKey: true,
  });
}

/**
 * 作业本管理 - 学员列表导出
 * @param {IExerciseStudentPageQuery} query
 */

export function exportWorkbookStudent(payload: { query: IExerciseStudentPageQuery }) {
  return visAjax('POST', '/supv/homework/workbook-manage/exportStudent.json', payload);
}

/**
 * 查询作业奖励规则
 * @param {}
 */

export function getExerciseReward(payload: { query: IKdtId }) {
  return visAjax('GET', '/supv/homework/award-manage/getExerciseReward.json', payload);
}

/**
 * 修改作业奖励规则
 * @param {}
 */

export function saveExerciseReward(payload: { query: IExerciseReward }) {
  return visAjax('POST', '/supv/homework/award-manage/saveExerciseReward.json', payload);
}
