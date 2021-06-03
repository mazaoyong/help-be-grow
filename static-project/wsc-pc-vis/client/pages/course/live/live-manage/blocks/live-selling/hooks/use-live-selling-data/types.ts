import React from 'react';

export interface IUseLiveSellingDataParams {
  liveRoomId: number;
}

export type SetDataType = 'add' | 'modify';
export interface IBaseAPIProps<T> {
  loading: boolean;
  setLoading: React.Dispatch<boolean>;
  /** delete 是保留字 */
  deleteData(data: T | T[]): void;
  setData(data: T | T[], type: SetDataType): void;
  refresh(): void;
}
