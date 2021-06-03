import { IGridColumn } from 'zent';
import { Dispatch, SetStateAction } from 'react';

export type IFormMultiFieldType = 'start' | 'end';

export interface ICourseQuery {
  kdtId: number;
  name: string;
  applicableCampusType: 0 | 1 | 2;
}

interface IStudentInfo {
  id?: string | number;
  studentName: string;
  mobile: string;
  className?: string;
  courseName: string;
  courseRealPay: string;
  payTool: string;
  enrollTime?: string;
  courseCounselor: string;
}

export interface IStudentInfoGrid extends IStudentInfo {
  totalCourseTime?: string;
  availableCourseTime?: string;
  validStartTime?: string;
  validEndTime?: string;
}

export interface IUpsertStudentForm extends IStudentInfo {
  period?: [string, string];
  validDate?: [string, string];
}

export interface IRowData {
  id?: number;
  dataSignCode: string;
  kdtId: number;
  row: RowType;
  rowFieldMap: IStudentInfoGrid;
  rowFieldValidateFlag: number;
  rowValidateFlag: number;
  taskId: number;
}

export interface IUpsertStudentProps {
  importType: number;
  onSave: () => void;
  onClose: () => void;
  taskId?: number;
  rowId?: number;
  branchKdtId?: number;
}

export interface IImportStudentGridColumn extends IGridColumn {
  type?: 'course' | 'class';
}

export interface IUploadConfirmProps {
  importType: number;
}

type RowFieldValidateInfoType = {
  message: string;
  validateCode: number;
};

export interface IRowFieldMap {
  name: string;
  rowFieldValidateInfo: null | RowFieldValidateInfoType;
  value: string | number;
}

export type RowType = {
  rowId: number;
  rowState: number;
  rowValidateInfos: null | RowFieldValidateInfoType[];
};

export interface IRowDataRequest {
  fields?: IUpsertStudentForm;
  taskId: number;
  rowId?: number;
}

export interface IBatchUpdateFieldRequest {
  fieldName: string;
  rowIds: number[];
  taskId: number;
  value: string;
}

export interface IDuplicateListProps {
  taskId: number;
  dataSignCode: string;
  importType: number;
  upsertDialogOpen: boolean;
  setUpsertDialogOpen: Dispatch<SetStateAction<boolean>>;
  dataColumns: IGridColumn[];
  branchKdtId?: number;
  studentProfile?: TStudentProfile[];
  areaOptions?: any;
}

export type IConflictListProps = IDuplicateListProps & { rowId: number };

export interface IBatchDeleteRequest {
  rowIds: number[];
  taskId: number;
}

export type IRequestByTaskIdType = {
  taskId: number;
  cover?: 0 | 1;
};

export type IRequestTaskProgressType = {
  importStage: number;
  taskId: number;
};

export interface getPageDataRequest {
  taskId: number;
  dataSignCodes?: string[];
  rowIds?: number[];
}

export interface getDuplicateRowsRequest {
  taskId: number;
  rowStates: number[];
  dataSignCode: string;
}

export interface IBatchUpdateFooterProps {
  importType: number;
  taskId: number;
  selected: number[];
  setSelected: Dispatch<SetStateAction<number[]>>;
  getPageValidateSummary: (query: IRequestByTaskIdType) => void;
  branchKdtId: number;
}

export interface IColumn {
  attrItem: Array<{ id: number | string; order: number; value: string }>;
  attributeId: number;
  attributeKey: string;
  attributeTags: string[];
  attributeTitle: string;
  attributeType: number;
  createdAt: number;
  dataType: number;
  needFill: boolean;
  serialNo: number;
  sortNum: number;
}

export type TStudentProfile = IColumn & { applicableScenes: Array<{ required: boolean }> };
