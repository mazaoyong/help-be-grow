export interface IOpenSignInParams {
  afterSignIn: () => void;
  signInType: SignInType;
  consumeNum: number | null;
  studentLessonNos: number[];
  startTime: number;
  studentName?: string;
  kdtId: number;
  isbatch?: boolean;
}

export enum SignInType {
  Attendance = 0,
  Leave = 1,
  Truancy = 2,
  // 添加student.signStatus的签到状态
  SignInAttendance = 4,
  SignInLeave = 7,
  SignInTruancy = 6,
}

export interface IAfterBatchSigninProps {
  type: SignInType;
  data: {
    failedNum: number;
    successNum: number;
    studentErrorDTOS: IBatchDetailDataProps[];
  }
  onConfirm?: Function;
}

export interface IBatchDetailDataProps {
  checkCode: number;
  extMsg: string; // 额外信息
  msg: string // 错误信息
  studentId: number // 学员id
  studentName: string// 学员姓名
}
