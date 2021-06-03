export interface IEduClassDefaultData {
  eduClass: any;
  classStat: {
    // 班级人数下限
    currentStuNum: number;
  };
  shopName: any;
  kdtId: any;
  createDefault: any;
}
export interface IEduClassProps {
  close: () => void;
  callback: () => void;
  onClassCallback: (nextClass?: any) => void;
  handleSubmit: (key: (object) => void) => any;
  defaultData: IEduClassDefaultData;
}

export interface IEduClassState {
  isEdit: boolean;
  submitLoading: boolean;
  eduClassName: string;
  kdtId: number | string;
  eduCourseId: string;
  eduCourseName: string;
  startTime: string;
  endTime: string;
  maxStuNum: string;
  currentStuNum: number;
  shopName: string;
}
