import type { IWorkbookFormEdit } from 'domain/workbook-domain/types';
import type { IHomeworkDetailDTO } from 'domain/homework-domain/types/homework';
import type {
  IStudentBriefDTO,
  IExerciseDetailItemDTO,
  IReviewerDTO,
} from 'definitions/api/owl/pc/ReviewerFacade/getAssignment';
import type { IDateRange } from 'definitions/api/owl/pc/ReviewerFacade/assignmentSort';
import { IExerciseDetailItemCommand } from 'definitions/api/owl/pc/ReviewerFacade/review';

export enum BooleanLike {
  False = 0,
  True,
}

export interface ICorrectReview {
  draft: Partial<ICorrectFormData>;
  comment: Partial<ICorrectFormData>;
  reviewTime: string;
  reviewer: IReviewerDTO;
}

export interface ICorrectDTO {
  id: number | null;
  hasReviewed: boolean;
  answerDetail: IExerciseDetailItemDTO[];
  workbook: IWorkbookFormEdit;
  homework: IHomeworkDetailDTO;
  reviewDTO: ICorrectReview;
  studentDTO: IStudentBriefDTO;
  hasQuit: BooleanLike;
}

/** 页面来源 */
export enum CorrectPageSource {
  /** 来自学员维度，查看的是学员的所有作业 */
  FROM_STUDENT = 1,
  /** 来自作业维度，查看的是作业下面的所有学员作业 */
  FROM_HOMEWORK,
}

/** 是否优秀作业的筛选条件 */
export enum AssignmentQualityQuery {
  /** 全部 */
  ALL = 0,
  /** 优秀作业 */
  GOOD,
  /** 非优秀作业 */
  NORMAL,
}

export enum AssignmentStatusQuery {
  /** 查询所有 */
  ALL = 0,
  /** 未批阅 */
  NOT_CORRECTED,
  /** 已批阅 */
  CORRECTED,
}

export interface ICorrectSibilingsQuery {
  /** 作业本id */
  workbookId?: number;
  /**
   * 批阅人
   *  如果查询全部批阅人，为空
   *  指定批阅人，批阅人的员工id
   */
  reviewerId?: number;
  channel?: CorrectPageSource;
  /** 提交时间 */
  submitTimeRange?: IDateRange;
  /** 排序的字段 */
  orderBy?: string;
  order?: string;
  /** 作业标题 */
  title?: string;
  /** 当前所在的学员作业id */
  assignmentId?: number;
  /** 学员id */
  userId?: number;
  /** 作业id */
  homeworkId?: number;
  /**
   * 成绩的排名
   *  0：全部
   *  1：优秀作业
   *  2：非优秀作业
   */
  isGoodAssignment?: AssignmentQualityQuery;
  /** 发布时间 */
  publishTimeRange?: IDateRange;
  /** 学员姓名 */
  studentName?: string;
  /**
   * 学员作业的状态
   *  0：查询所有
   *  1：未批阅
   *  2：已批阅
   */
  status?: AssignmentStatusQuery;
}

/** 提交方式 */
export enum CorrectSubmitType {
  /** 1 = 正常提交 */
  NORMAL = 1,
  /** 2 = 提交草稿 */
  DRAFT,
}

interface ICorrectBase {
  /** 分数 */
  score: string;
  /**
   * 是否是优秀作业
   *  0：否
   *  1：是
   */
  isGoodAssignment: BooleanLike;
  type: CorrectSubmitType;
  /** 学生作业id */
  assignmentId: number;
}

/** 批阅内容 */
export interface ICorrectFormData extends ICorrectBase {
  /** 评语 */
  comment: IExerciseDetailItemDTO[];
}

export interface ICorrectDetailData extends ICorrectBase {
  /** 评语 */
  comment: IExerciseDetailItemCommand[];
}
