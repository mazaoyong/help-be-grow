import type {
  FilterConfigType,
  FilterRefType,
  IEasyGridColumn,
  IListProps,
} from '@youzan/ebiz-components/es/types/easy-list';

export interface IUseSigninListModelOpts {}
export interface IUseSigninListModelRes {
  /** EasyList filter config */
  filterConfig: FilterConfigType;
  /** EasyList collapse config */
  collapseConfig: FilterConfigType;
  /** EasyList grid config */
  gridConfig: IEasyGridColumn[];
  /** EasyList fetch list */
  fetchList: IListProps['onSubmit'];
  /** export signin records */
  handleExportSigninRecords(filterRef: FilterRefType): Promise<boolean>;
}
export type UseSigninListModel = (opts?: IUseSigninListModelOpts) => IUseSigninListModelRes;
