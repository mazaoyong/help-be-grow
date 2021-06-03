import type {
  IListProps,
  IEasyGridColumn,
  FilterConfigType,
  FilterRefType,
} from '@youzan/ebiz-components/es/types/easy-list';
import type { IEduAssetSubOperationInfoDTO } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetSubOperationPage';
import type { IEduAssetSubBriefDTO } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetSubOperationBriefInfo';

export interface IUseManualConsumeModelParams {
  studentId: string | undefined;
  assetNo: string | undefined;
}
export enum LoadingSection {
  SUMMARY_INFO = 'summaryInfo',
}
export interface IUseManualConsumeModelRes {
  filterConfig: FilterConfigType;
  gridConfig: IEasyGridColumn<Required<IEduAssetSubOperationInfoDTO>>[];
  manualConsumeSummaryData: IEduAssetSubBriefDTO;
  loadingCollection: Record<LoadingSection, boolean>;
  fetchList: IListProps['onSubmit'];
  exportRecordsDetail(filter: FilterRefType): Promise<boolean>;
}
export type UseManualConsumeModelType = (
  params: IUseManualConsumeModelParams,
) => IUseManualConsumeModelRes;
