import { parseHomeworkDetail } from 'domain/homework-domain/data-source/translator';
import { workbookDataToFormData } from 'domain/workbook-domain/data-source/translator';
import type { ICorrectDTO, ICorrectFormData, ICorrectSibilingsQuery, ICorrectReview, ICorrectDetailData } from '../types';
import type { IAssignmentDTO, IHomeworkReviewDTO } from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import type { IAssignmentSortQuery } from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import type { IReviewCommand } from 'definitions/api/owl/pc/ReviewerFacade/review';

/** 获取批阅详情，解析后端数据 */
export const parseCorrectData = (data: IAssignmentDTO): ICorrectDTO => {
  const {
    studentDTO,
    hasReviewed,
    answerDetail,
    homework,
    reviewDTO,
    exercise,
    studentStatus,
    assignmentId,
  } = data;

  return {
    id: assignmentId,
    hasReviewed,
    answerDetail,
    studentDTO,
    reviewDTO: transferCorrectData(reviewDTO),
    // @ts-ignore 这边的是简易版homeworkDetail
    homework: parseHomeworkDetail(homework),
    workbook: workbookDataToFormData(exercise),
    hasQuit: studentStatus,
  };
};

/** 批阅 - 获取上一个下一个信息请求转化为后端接收参数类型 */
export const parseCorrectSibilingsQuery = (data: ICorrectSibilingsQuery): IAssignmentSortQuery => {
  const {
    workbookId,
    reviewerId,
    channel,
    submitTimeRange,
    orderBy,
    order,
    title,
    assignmentId,
    userId,
    homeworkId,
    isGoodAssignment,
    publishTimeRange,
    studentName,
    status,
  } = data;

  return {
    exerciseBookId: workbookId,
    reviewerId,
    channel,
    submitTimeRange,
    orderBy,
    order,
    title,
    assignmentId,
    userId,
    homeworkId,
    excellentScore: isGoodAssignment,
    publishTimeRange,
    studentName,
    status,
  };
};

/** 批阅提交数据转化为后端提交数据 */
export const parseCorrectFormData = (data: ICorrectDetailData): IReviewCommand => {
  const {
    score,
    isGoodAssignment,
    comment,
    type,
    assignmentId,
  } = data;

  return {
    score,
    excellentScore: isGoodAssignment,
    comment,
    type,
    assignmentId,
  };
};

const parseCommentData = (data): Partial<ICorrectFormData> => {
  const {
    score,
    excellentScore,
    comment,
  } = data || {};

  return {
    ...data,
    score,
    isGoodAssignment: excellentScore,
    comment,
  };
};

/** 后端批阅数据转化为前端表单数据 */
export const transferCorrectData = (data: IHomeworkReviewDTO): ICorrectReview => {
  const {
    comment,
    draft,
    reviewer,
    reviewTime,
  } = data || {};

  return {
    comment: parseCommentData(comment),
    draft: parseCommentData(draft),
    reviewer,
    reviewTime,
  };
};
