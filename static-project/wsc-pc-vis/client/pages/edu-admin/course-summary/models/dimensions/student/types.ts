import type {
  FilterConfigType,
  FilterRefType,
  IEasyGridColumn,
  IListProps,
} from '@youzan/ebiz-components/es/types/easy-list';

export interface IStudentSummaryModelParams {}
export interface IStudentSummaryModel {
  filterConfig: FilterConfigType;
  gridConfig: IEasyGridColumn[];
  defaultFilter: Record<string, any>;
  fetchStudentSummaryList: IListProps['onSubmit'];
  exportStudentList(filter: FilterRefType): Promise<boolean>;
}
