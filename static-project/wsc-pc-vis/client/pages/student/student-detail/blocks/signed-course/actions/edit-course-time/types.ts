// import { IFormatedSignedCourseItem } from '../../types';
import { IAssetCourseTimeUpdateDTO } from 'definitions/api/owl/pc/AssetFacade/getAssetCourseTimeUpdateInfo';

export interface IEditCourseTimeCourse {
  course: {
    title: string;
  };
  eduCourse: {
    name: string;
  };
  courseTime: {
    remaining: number;
    total: number;
  };
  assetNo: string
}

export interface IEditCourseTimeStudent {
  id: number;
  name: string;
  mobile: number;
};

export interface IEditCourseTimeProps {
  kdtId: number;
  assetNo: IEditCourseTimeCourse['assetNo'],
  studentId: IEditCourseTimeStudent['id'],
}

export interface IEditCourseTimeState {
  type: number;
  reduceType: number; // 扣减课时类型
  number: number;
  mark: string;
  inputCheckErrorMsg: string;
  inputMarkErrorMsg: string;

  localData: IAssetCourseTimeUpdateInfoReturns,
}

export type IEditCourseTimeReturns = IEditCourseTimeProps & {
  type: number;
  number: number;
  mark: string;
  reduceType: number;
}

export interface IModifyTypeTipsProps {
  type: number;
}

export interface IOpenDoubleCheckProps {
  type: number;
  changedNum: number;
  remainNum: number;
  totalNum: number;
  reduceType: number;
}

export type IAssetCourseTimeUpdateInfoReturns = IAssetCourseTimeUpdateDTO;
