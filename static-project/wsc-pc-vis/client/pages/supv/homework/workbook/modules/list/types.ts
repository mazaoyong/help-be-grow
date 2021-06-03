export interface IWorkbookListFilter {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
  createAtDateRange?: [string, string];
  title?: string;
  status?: string;
}
