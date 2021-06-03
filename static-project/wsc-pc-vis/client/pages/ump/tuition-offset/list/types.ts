import { EventStatus } from '../types';

export interface IListpageQuery extends Record<string, any> {
  page: number,
  pageSize: number,
  name?: string,
  status?: EventStatus,
}
