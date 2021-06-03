import { ISelectedClass } from '../../types';

export interface IEduClassListQuery {
  page: number;
  pageSize: number;
  sortBy: string;
  sortType: string;
  name: string;
}

export interface ISelectClassDialogContent {
  selected: ISelectedClass;
  onChange: (classData: ISelectedClass) => void;
}

export interface IClassSelector {
  value: ISelectedClass;
  onChange: (classData: ISelectedClass | null) => void;
  disabled?: boolean;
  dialogProps?: Record<string, any>;
}
