import { ReactNode } from 'react';

export type ObjectLike<T = any> = Record<string, T>;
export enum DataType {
  TEXT = 0,
  NUMBER,
  DATE,
  PROVINCE,
  GENDER,
  IMAGE,
  ADDRESS,
  SELECT,
  MULTI_SELECT,
  PHONE,
}

export interface IProfileField {
  label: string;
  name: any;
  defaultValue: any;
  dataType: DataType;
  placeholder?: string;
  options?: Array<{
    text: ReactNode;
    value: any;
  }>;
  // 关于字符串映射
  watch?: any;
  disabled?: true;
  required?: boolean | string;
  disabledDate?: (Date) => boolean;
}

export enum ApplicableSceneEnums {
  ALL_SCENES = 0,
  STUDENT_SCENE,
  CLUE_SCENE,
}

export interface IFormatSubmitOptions {
  addressFormatter?: (addresses: Array<{ code: string; name: string }>) => string;
  selectFormatter?: (item: any) => string;
  genderFormatter?: (item: any) => string;
}
export interface ICustomProfileProps {
  applicableScene: ApplicableSceneEnums;
  studentNo?: number | string;
  clueId?: number;
  refreshSignal?: number;
  submitSignal?: number;
  validateSignal?: boolean;
  formatSubmitOptions?: IFormatSubmitOptions;
  fetchProfileApi?: ({ applicableScene: ApplicableSceneEnums }) => Promise<any>;
  fetchStudentInfoApi?: ({ identityNo: string, clueId: number }) => Promise<Record<string, any>>;
  showInfoTip?: boolean;
  onSubmit(values: Record<string, any>[]): void;
}

export interface IApolloRes extends Record<string, any> {
  placeholders: string[];
}
