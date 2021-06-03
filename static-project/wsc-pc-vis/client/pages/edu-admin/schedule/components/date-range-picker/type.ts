export interface IData {
  startTime: string;
  endTime: string;
  configType: number;
  id?: number;
}

export interface IDateRangePickerState {
  loading: boolean;
  creating: boolean;
  list: IData[];
  editing: string;
}

export interface IDateRangePickerCellProps {
  data: IData;
  isEdit: boolean;
  hasSave: boolean;
  className: string;
  setEdit: (data?: IData) => void;
  onSave: (data: IData) => void;
  onDelete?: (data: IData) => void;
  getTime: (data?: IData | undefined) => void;
}

export interface IDateRangePickerCellState {
  startTime: string;
  endTime: string;
}
