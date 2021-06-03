import { IEduAssetOperationBriefDTO } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationBriefInfo';
export interface IRouteParams {
  studentId: number;
}

export interface IBlockHeaderProps {
  studentId: IRouteParams['studentId'];
  assetNo: string;
  kdtId: number;
  handleBlockShowStatus: Function;
}

export interface IBlockHeaderInfoProps {
  info: IHeaderState;
}

export interface IRouteQuery {
  assetNo: string;
  kdtId: number;
}

export type IHeaderState = IEduAssetOperationBriefDTO | {};

export interface IBlockShowStatus {
  hasAssetValue: boolean;
  hasAssetValidity: boolean;
  hasAssetClass: boolean;
}
