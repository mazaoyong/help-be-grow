interface IListQueryBase {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
}

export interface IHomeworkListQuery extends IListQueryBase {
  title?: string;
}

export interface IWorkbookStudentListFilter extends IListQueryBase {
  joinTime?: (string | null)[];
  name?: string;
}

export interface IWorkbookManageStudentFilter {
  pageSize: number;
  page: number;
  sortBy?: string;
  sortType?: string;
  joinTime?: [string, string];
  name?: string;
}
