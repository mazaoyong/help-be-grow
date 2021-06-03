import { visAjax } from 'fns/new-ajax';
import { IAssignmentSortQuery } from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import { IReviewCommand } from 'definitions/api/owl/pc/ReviewerFacade/review';

/**
 * 批阅 - 获取批阅页面信息（包含试卷、答题、批阅信息）
 * @param {number} id
 */

export function getAssignment(payload: { id: number }) {
  return visAjax('GET', '/supv/homework/assignment/getAssignment.json', payload);
};

/**
 * 批阅 - 获取当前批阅的上一个、下一个批阅的信息
 * @param {IAssignmentSortQuery} payload
 */

export function getCorrectSiblingIds(payload: IAssignmentSortQuery) {
  return visAjax('POST', '/supv/homework/assignment/assignmentSort.json', payload, { cleanEmptyString: true }); // 用POST防止header过长
};

/**
 * 批阅 - 提交批阅
 * @param {IReviewCommand} payload
 */

export function review(payload: IReviewCommand) {
  return visAjax('POST', '/supv/homework/assignment/review.json', payload, { cleanEmptyString: true });
};
