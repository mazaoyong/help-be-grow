import { workbookPublishStatus } from 'domain/workbook-domain/types';

export interface ISelectedClass {
  classId: number;
  name: string;
  isDeleted?: boolean;
}

export enum BooleanLike {
  False = 0,
  True,
}

export interface IWorkbookAdditon {
  id: number;
  alias: string;
  kdtId?: number;
  status: workbookPublishStatus;
}
