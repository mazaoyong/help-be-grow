import { ReactNode } from 'react';

export interface IAbnormalCodeDialogProps {
  type: number; // 0 签到 | 1 请假 | 2 未到 | -1 预约
  data: IAbnormalCodeDialogData;
  onConfirm?: Function;
  kdtId: number;
}

export interface IAbnormalCodeDialogData {
  assetNo: string; // 资产编号
  checkCode: number; // 检查错误码
  message: string; // 异常原因
  numCheckDetail: any; // 课时校验详情
  timeCheckDetail: any; // 时间校验详情
  studentLessonNo: string; // 修改预约时需要传入 lessonNo，解冻时需要此参数排除修改前的预约日程
}

export interface IAbnormalCodeDialogCofnig {
  code: AbnormalCode;
  desc: string;
  tips: (data: IAbnormalCodeDialogData, type?: number) => ReactNode;
}

// export enum SignInType {
//   Attendance = 0,
//   Leave = 1,
//   Truancy = 2,
//   // 添加student.signStatus的签到状态
//   SignInAttendance = 4,
//   SignInLeave = 7,
//   SignInTruancy = 6,
// }
