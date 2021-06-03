import type {
  FilterConfigType,
  FilterRefType,
  IEasyGridColumn,
  IListProps,
} from '@youzan/ebiz-components/es/types/easy-list';
import type { ISignInBriefInfoDTO } from 'definitions/api/owl/pc/SignInFacade/findSignInBrieInfo';

export interface IUseRecordsDetailModelParams {
  userId: string | undefined;
  assetNo: string | undefined;
}
export enum LoadingSection {
  SUMMARY_INFO = 'summaryInfo',
}
export interface IUseRecordsDetailModelRes {
  /** EasyList filter config */
  filterConfig: FilterConfigType;
  /** EasyList collapse config */
  collapseConfig: FilterConfigType;
  /** EasyList grid config */
  gridConfig: IEasyGridColumn[];
  recordsSummaryData: ISignInBriefInfoDTO;
  loadingCollection: Record<LoadingSection, boolean>;
  /** EasyList fetch list */
  fetchList: IListProps['onSubmit'];
  /** export records of course-summary detail */
  exportRecordsDetail(filterRef: FilterRefType): Promise<boolean>;
}
export type UseRecordsDetailModel = (
  opts: IUseRecordsDetailModelParams,
) => IUseRecordsDetailModelRes;
