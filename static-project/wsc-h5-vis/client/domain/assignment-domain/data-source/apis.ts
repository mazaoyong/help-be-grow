import { IMediaBlock } from '@/domain/workbook-domain/entities/workbook';
import { ajax } from '@youzan/vis-ui';
import { IPage, IAssignmentPageDTO, IPageRequest } from 'definitions/api/owl/api/UserExerciseFacade/findUserAssignmentPage';
import { IAssignmentExchangePageDTO } from 'definitions/api/owl/api/UserExerciseFacade/findAssignmentExchangePage';
import { IUserAssignmentDTO } from 'definitions/api/owl/api/UserExerciseFacade/getStudentAssignment';
import { IStudentBriefDTO } from 'definitions/api/owl/api/UserExerciseFacade/getHomeworkDetail';

interface IAssignmentListQuery {
  /** 作业本别称 */
  alias: string;
  /** 学员id */
  studentId?: number;
  /** 作业本状态：0 全部 1 未完成且未截止 2 未完成且已截止 3 已完成 */
  status?: number;
}
export interface IAssignmentListPayload {
  pageRequest?: IPageRequest;
  query: IAssignmentListQuery;
}

/** 提交类型 */
export enum SubmitTypeEnum {
  /** 正式提交 */
  SUBMIT = 1,
  /** 草稿 */
  DRAFT = 2
}

export interface IAjaxExtraOption {
  loading?: boolean;
  withErrorCode?: boolean;
}

export interface ISubmitPayload {
  /** 学员id */
  studentId: number;
  /** 答案 */
  answer: IMediaBlock[];
  /** 学员作业id，没提交的时候也能获取到 */
  assignmentId: number;
  /**
   * 提交的类型
   *  1：提交
   *  2：草稿
   */
  type: SubmitTypeEnum;
  /** 作业本所属店铺kdtId */
  targetKdtId: number;
}

export interface ISharePayload {
  studentId: number, // 学员id
  assignmentId: number, // 学员作业id
}

export interface IOtherStudentListQuery {
  pageSize: number;
  pageNumber: number;
  homeworkAlias: string;
  studentId: number;
}

export interface IOtherStudentInfoQuery {
  assignmentId: number;
}

/** 获取学员作业列表 */

export function getAssignmentList(payload: IAssignmentListPayload): Promise<IPage<IAssignmentPageDTO>> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/findUserAssignmentPage.json',
    data: {
      ...payload.query,
      ...payload.pageRequest,
    },
  });
}

/** 提交作业 */

export function submitAssignment(payload: ISubmitPayload): Promise<boolean> {
  return ajax({
    method: 'POST',
    url: '/wscvis/supv/homework/submitAssignment.json',
    data: payload,
    rawResponse: true,
    loading: payload.type !== SubmitTypeEnum.DRAFT,
  });
}

/** 分享作业 */

export function shareHomework(payload: ISharePayload): Promise<boolean> {
  return ajax({
    method: 'POST',
    url: '/wscvis/supv/homework/shareHomework.json',
    data: payload,
  });
}

/**
 * assignmentId, alias选一个传进去
 *
 * @param studentId 学员id
 * @param assignmentId 学员作业id
 * @param alias 作业别称
 */

// eslint-disable-next-line max-len
export function getAssignment(studentId: number, assignmentId?: number, alias?: string, extraOptions?: IAjaxExtraOption): Promise<IUserAssignmentDTO> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/getStudentAssignment.json',
    data: {
      assignmentId,
      studentId,
      alias,
    },
    ...(extraOptions || {}),
  });
};

// eslint-disable-next-line max-len
export function getOtherStudentAssignmentList(payload: IOtherStudentListQuery, extraOptions?: IAjaxExtraOption): Promise<IPage<IAssignmentExchangePageDTO>> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/findAssignmentExchangePage.json',
    data: payload,
    ...(extraOptions || {}),
  });
};

export function getOtherStudentInfo(payload: IOtherStudentInfoQuery): Promise<IStudentBriefDTO[]> {
  return ajax({
    method: 'GET',
    url: '/wscvis/supv/homework/findOtherStudentInfo.json',
    data: payload,
    loading: false,
  });
};
