import { IParsedWorkbookAssignmentQuery } from 'domain/assignment-domain/types/assignment';

export interface IWorkbookAssignmentListQuery extends IParsedWorkbookAssignmentQuery {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
}

/** 是否为优秀作业的筛选项 */
export enum GoodAssignmentFilterStatus {
  /** 全部 */
  ALL = '0',
  /** 是（优秀作业） */
  GOOD_ONES = '1',
  /** 否（不是优秀作业） */
  NORMAL_ONES = '2',
}
