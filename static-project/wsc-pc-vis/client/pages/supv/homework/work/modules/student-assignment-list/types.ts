import { IParsedHomeworkAssignmentQuery } from 'domain/assignment-domain/types/assignment';

export interface IHomeworkAssignmentListQuery extends IParsedHomeworkAssignmentQuery {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
}
