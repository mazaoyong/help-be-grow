import type { IPageRequest, IHomeworkPageQuery } from 'definitions/api/owl/pc/HomeworkFacade/findPageByCondition';
import type { IExerciseDetailItemDTO } from 'definitions/api/owl/pc/HomeworkFacade/getHomeworkDetail';
import { BooleanLike } from './common';

export interface IHomeworkListQuery {
  query: IHomeworkPageQuery;
  pageRequest: IPageRequest;
}

export interface IHomeworkDetailQuery {
  homeworkId: number;
}

export enum homeworkInstockStatus {
  inStock = 1,
  outofStock,
  timer,
}

export interface IHomeworkListDTO {
  id: number;
  alias: string;
  title: string;
  kdtId: number;
  // workbookId: number;
  publishTime: string;
  deadlineTime: string;
  submitNum: number;
  totalNum: number;
  submitRatio: string;
  awaitMarkingNum: number;
  status: homeworkInstockStatus;
}

/** 评分规则(分数制/等第制) */
export enum RateType {
  /** 分数制 */
  POINT = 1,
  /** 等第制 */
  GRADE,
}

/** 评分规则(十分制/百分制) */
export enum ScoreRule {
  /** 十分制 */
  TEN = 1,
  /** 百分制 */
  HUNDRED,
}

export interface IHomeworkDetailDTO {
  /** 作业id */
  id: number;
  /** 评分机制 1：分数制 2：等第制 */
  rateType: RateType;
  /** 作业本id */
  workbookId: number;
  /** 定时发布的开关  1：开启 0：关闭 */
  hasPublishTimer: BooleanLike;
  /** 作业提交数，退出作业本的提交不算 */
  submitNum: number;
  /** 作业提交数，包含退出作业本的提交 */
  submitTotalNum: number;
  /** 别名 */
  alias: string;
  /** 定时上架时间 */
  timerPublishAt: string;
  /** 计分规则  1：十分制  2：百分制 */
  scoreRule: ScoreRule;
  /** 详情 */
  detail?: IExerciseDetailItemDTO[];
  /** 作业标题 */
  title: string;
  /** 截止日期 */
  deadlineTime: string;
  /** 作业本的状态 1：上架 2：下架 3：定时上架 */
  status: homeworkInstockStatus;
}

export enum frontMediaType {
  'Richtext' = 1,
  'Picture',
  'Audio',
  'Video',
}
