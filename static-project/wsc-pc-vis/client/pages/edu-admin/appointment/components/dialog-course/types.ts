export interface IDialogCourseFieldProps {
  courseType: number; // 预约类型
  studentId: number; // 学员ID
  assetNo?: string; // 资产信息
  disabled?: boolean; // 是否禁用
  onChoose?: (any) => void;
  eduCourseInfo?: TEduCourseInfo; // 课程信息
  branchInfo?: IBranchInfo; // 校区信息
  isConfirm: boolean; // 是否是确认预约
  isEdit: boolean; // 是否是在编辑预约
  lessonInfo: Partial<ILessonData>; // 选择的课节信息
  studentLessonNo: string; // 学员课表 id
}

export interface ITimeRange {
  startTime: number;
  endTime: number;
}

type TEduCourseInfo = {
  eduCourseId: number;
  eduCoursePlaceholder: string;
}

// 校区信息
type IBranchInfo = {
  kdtId: number;
  shopName: string;
}

export interface IDialogCourseProps {
  onClose: (any) => void;
  visible: boolean;
  onConfirm: (any) => void;
  courseType: number;
  studentId: number;
  assetNo: string;
  eduCourseInfo?: TEduCourseInfo;
  branchInfo?: IBranchInfo;
  isConfirm: boolean;
  isEdit: boolean;
  lessonInfo: Partial<ILessonData>;
  studentLessonNo: string;
}

type TStudentAsset = {
  studentId: number;
  assetNo?: string;
}

export interface IQueryLessionParams {
  startTime?: number;
  endTime?: number;
  addressId?: number;
  kdtId?: number;
  eduCourseId?: number;
  courseType: number;
  studentAsset: TStudentAsset;
  lessonName: string;
  simulateLessonNo?: string;
}

export interface ILessonData {
  addressName: string;
  appointNumLeft: number;
  appointRule: number;
  checkCode: number;
  className: string;
  classroomName: string;
  consumeNum: number;
  eduCourseId: number;
  eduCourseName: string;
  kdtId: number;
  lessonName: string;
  lessonNo: string;
  lessonTime: string;
  maxAppointNum: number;
  pass: boolean;
  reason: string;
  shopName: string;
  teacherName: string;
  trialCourseOccupyQuota: number;
}

export interface IDialogFooterProps {
  onClose: (any: any) => void;
  onConfirm: (any: any) => void;
}
