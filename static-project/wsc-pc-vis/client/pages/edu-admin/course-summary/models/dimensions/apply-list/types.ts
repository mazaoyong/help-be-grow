import type {
  FilterConfigType,
  IEasyGridColumn,
  IListProps,
  FilterRefType,
} from '@youzan/ebiz-components/es/types/easy-list';

export interface IApplyListSummaryModelParams {}
export interface IApplyListSummaryModel {
  filterConfig: FilterConfigType;
  filterCollapseConfig: FilterConfigType;
  gridConfig: IEasyGridColumn[];
  defaultFilter: Record<string, any>;
  fetchApplyListSummary: IListProps['onSubmit'];
  exportApplyList(filter: FilterRefType): Promise<boolean>;
}
