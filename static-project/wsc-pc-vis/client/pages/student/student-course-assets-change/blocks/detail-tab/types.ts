import { IEduAssetOperationQuery } from 'definitions/api/owl/pc/EduAssetOperationFacade/queryAssetOperationPage';
import { IBlockShowStatus } from '../../types';

export interface IListQuery extends IEduAssetOperationQuery {};

export interface IDetailTabProps {
  studentId: number;
  assetNo: string;
  kdtId: number;
  blockShowStatus: IBlockShowStatus;
}

export interface ITabProps {
  studentId: number;
  assetNo: string;
  kdtId: number;
}
