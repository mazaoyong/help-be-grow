import { ReactNode } from 'react';

enum SignInType {
  Attendance = 0,
  Leave = 1,
  Truancy = 2,
  // 添加student.signStatus的签到状态
  SignInAttendance = 4,
  SignInLeave = 7,
  SignInTruancy = 6,
}

export interface ISigninDialogProps {
  isFuture: boolean;
  isbatch: boolean;
  type: SignInType;
  onSigninConfirm: (id: string) => void;
  data: ISigninTipsDialogParams;
}

export type TSigninValidateData = ISingleSigninValidateData |IBatchSigninValidateData;

export interface ISingleSigninValidateData {
  activeTime: string; // 生效时间
  assetNo: string; // 资产编号
  consumeNum: number; // 消耗课时
  cancelStudentLessonNum: number; // 待取消的学员课表数
  studentName: string; // 需要签到的学员名称
  signInTipType: number; // 提示类型
}

export interface IBatchSigninValidateData {
  activeStudentNum: number; // 签到后资产生效的学员数
  activeTime: string; // 生效时间
  assetNos: string[]; // 批量资产编号
  activeStudentNames: string[]; // 生效学员姓名
  consumeNum: number; // 消耗课时
  cancelStudentLessonNum: number; // 待取消的学员课表数
  signInTipType: number; // 提示类型
  signInStudentNum: number; // 批量签到学员数
}

export interface ISigninTipsDialogParams {
  kdtId: number;
  lessonNo?: string;
  signInType: SignInType
  studentLessonNos?: string[];
  studentLessonNo?: string;
}

export type TSiginTipProps = {
  code: number;
  bodyRender: (validateData: any) => ReactNode;
}

export type TSigninDialogContentProps = ISigninDialogProps & {
  validateData?: TSigninValidateData;
} & {
  loading: boolean;
};

export type TSigninDialogFooterProps = {
  isbatch: boolean;
  type: SignInType;
  onCancel: () => void;
  onConfirm: () => void;
  event?: any;
};

/** 资产关联的课程类型 */
export enum assetCourseType {
  /** 体验课 */
  trial = 'TRIAL_COURSE',
  /** 正式课 */
  formal = 'FORMAL_COURSE',
}
