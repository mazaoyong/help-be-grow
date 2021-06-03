export interface ICourseDialogProps {
  available: number;
  consumeNum: number;
  locked: number;
  startTime?: string;
  endTime?: string;
  kdtId: number;
  assetNos: string[];
  onConfirm?: Function;
  studentLessonNo: string; // 用于修改时解冻
  needRemoved: number;
  isEdit: boolean;
}

export type TCourseDialogListProps = Omit<ICourseDialogProps, 'available' | 'consumeNum' | 'locked' | 'needRemoved' | 'isEdit'>
