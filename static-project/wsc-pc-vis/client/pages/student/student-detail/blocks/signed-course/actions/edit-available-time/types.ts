export interface IEditAvailableTimeProps {
  startTime: string;
  endTime: string;
  mark: string;
  kdtId: number;
  assetNo: string;
  studentId: number;
};

export interface StuAssetInfo {
  lastSignTime: number;
  validityEndTime: number;
}

export type IEditAvailableTimeReturns = IEditAvailableTimeProps;
