import { BooleanLike } from './common';
import type {
  IPageRequest,
  IUserAssignmentQuery,
  IDateRange,
} from 'definitions/api/owl/pc/AssignmentFacade/findExerciseAssignmentPage';
import type { IHomeworkAssignmentQuery } from 'definitions/api/owl/pc/AssignmentFacade/findHomeworkAssignmentPage';

export enum WorkbookStudentStatus {
  /** 未退出作业本 */
  NOT_QUIT = 1,
  /** 已退出作业本 */
  QUIT,
}

export interface IWorkbookAssignmentListQuery {
  query: IUserAssignmentQuery;
  pageRequest: IPageRequest;
}

export interface IHomeworkAssignmentListQuery {
  query: IHomeworkAssignmentQuery;
  pageRequest: IPageRequest;
}

export interface IParsedWorkbookAssignmentListQuery {
  query: IParsedWorkbookAssignmentQuery;
  pageRequest: IPageRequest;
}

export interface IParsedHomeworkAssignmentListQuery {
  query: IParsedHomeworkAssignmentQuery;
  pageRequest: IPageRequest;
}

export interface IParsedWorkbookAssignmentQuery {
  studentId: number;
  reviewerId: number;
  workbookId: number;
  isGoodAssignment?: BooleanLike;
  status?: StudentAssignmentQueryStatus;
  publishTimeRange?: IDateRange;
  submitTimeRange?: IDateRange;
  title?: string;
}

export interface IParsedHomeworkAssignmentQuery {
  workbookId: number;
  homeworkId: number;
  reviewerId?: number;
  studentName?: string;
  status?: StudentAssignmentQueryStatus;
}

export enum StudentType {
  /** 客户 */
  CUSTOMER = 1,
  /** 学员 */
  STUDENT,
}

/** 筛选条件中学员作业状态 */
export enum StudentAssignmentQueryStatus {
  ALL = 0,
  UNMARKED,
  MARKED,
}

/** 列表数据中作业提交状态 */
export enum StudentAssignmentSubmitStatus {
  /** 未提交 */
  UNSUBMITTED = 11,
  /** 已提交/未批阅 */
  AWAIT_MARKING = 21,
  /** 已批阅 */
  MARKED = 31,
}

export interface IAssignmentDTO {
  /** 作业名称 */
  title: string;
  /** 学生作业id */
  assignmentId: number;
  /** 作业id */
  homeworkId: number;
  /** 作业本id */
  workbookId: number;
  /** 用户类型：客户 or 学员 */
  studentRole: StudentType;
  /** 姓名 */
  studentName: string;
  /** 手机号 */
  studentMobile: string;
  /** 头像 */
  studentAvatar: string;
  /** 学员id */
  studentId: number;
  /** 作业发布时间 */
  publishTime: string;
  /** 作业分数 */
  score: string;
  /** 提交时间 */
  submitTime: string;
  /** 是否是优秀作业 */
  isGoodAssignment: BooleanLike;
  /** 是否退出作业本 */
  hasQuit: WorkbookStudentStatus;
  /** 作业状态 */
  status: StudentAssignmentSubmitStatus;
  /** 批阅人id */
  reviewerUserId: number;
  /** 批阅人用户名 */
  reviewerUsername: string;
  /** 批阅人手机号 */
  reviewerMobile: string;
}

export interface IHomeworkAssignmentListDTO extends IAssignmentDTO {
  detailLink: string;
  assignmentRateText: string;
  statusText: string;
  operationText: string;
  operationLink: string;
}

export interface IWorkbookAssignmentListDTO extends IAssignmentDTO {
  assignmentRateText: string;
  statusText: string;
  operationText: string;
  operationLink: string;
}
