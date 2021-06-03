// 1：创建排课，2：编辑单个课节，3：编辑单个及后续
enum OperateType {
  Create = 1,
  EditSingle,
  EditOther
}

// 0: no-repeat, 1: repeat day, 2: repeat-week
enum RepeatType {
  NoRepeat = 0,
  RepeatDay,
  RepeatWeek,
}

export type TQueryParams = {
  eduCourseId?: number;
  classNo?: number;
  teacherNo?: string,
  teacherName?: string;
  startTime?: string | number; // 开始日期与开始时间
  endTime?: string | number;
  duplicate?: boolean;
  classroomNo?: string;
  classroomName?: string;
}

export interface IScheduleProps {
  lessonNo?: string;
  kdtId?: string;
  operateType?: OperateType;
  isTry?: boolean;
  zentForm: any;
  close: () => void;
  handleSubmit: (key: (object) => void) => any;
  query?: TQueryParams;
  afterSaveSucceed?: (data: any, scheduleId: string) => void; // 保存成功之后的回调
  afterSaveError?: () => void;
}

export interface IScheduleState {
  operateType: OperateType;
  btnLoading: boolean;
  repeatType: RepeatType;
  scheduleDetail: any; // 用于排课回显
  inValidRules: Array<any>; // 不通过校验的规则
  dateRangeConfig: Array<any>;
  attachOptions: any;
  endType: number;
  noNextYearLegalHoliday: boolean;
  assistantsSelectKey: number;
  independentConfigVisible: boolean;
}
