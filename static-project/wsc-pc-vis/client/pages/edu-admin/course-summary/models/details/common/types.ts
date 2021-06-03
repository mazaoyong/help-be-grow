import type { IAssetDetailDTO } from 'definitions/api/owl/pc/SignSummaryFacade/getAssetDetail';
import type { ICardRenderProps } from '@youzan/ebiz-components/es/types/card-item';

interface IUseSummaryDetailCommonModelParams {
  studentId: string;
  assetNo: string;
  overviewType: string;
  queryString: string;
}

interface IStudentInfo {
  name: string;
  mobile: string;
}
export interface IUseSummaryDetailCommonModelRes {
  studentInfo: IStudentInfo | null;
  /** 资产信息 */
  assetInfo: IAssetDetailDTO | null;
  loading: boolean;
  /** 如果是课时维度的明细，需要展示课程资产信息 */
  overviewContentConfig:
  | {
    contentGroup: ICardRenderProps['contentGroup'];
  }
  | {};
  dumpFilter: Record<string, any>;
}
export type NotNullCommonModelRes = {
  [K in keyof IUseSummaryDetailCommonModelRes]-?: NonNullable<IUseSummaryDetailCommonModelRes[K]>;
};
export type UseSummaryDetailCommonModelType = (
  params: IUseSummaryDetailCommonModelParams,
) => IUseSummaryDetailCommonModelRes;
