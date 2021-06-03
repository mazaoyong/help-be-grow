export interface IEduCourseDialogProps {
  onConfirm: (item: any) => void;
  kdtId: number;
}

export interface IEduCourseListProps {
  kdtId: number;
  onConfirm: (item: any) => void;
  onClose: () => void;
}
