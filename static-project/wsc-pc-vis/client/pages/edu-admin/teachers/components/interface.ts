
export interface IListDataSets {
  datasets: any[];
  current: number;
  total: number;
};

export interface ITeacherInfo {
  icon: string;
  sex: string;
  teacherName: string;
  mobile: string;
  duty: string;
  staffName: string;
  description: string;
  resource: any;
  shopName: string;
  [index: string]: any;
};

export interface IStatistics {
  actualStudentCount: number;
  consumeAssetNum: number;
  shouldStudentCount: number;
  teachClassCount: number;
  tryAttendCount: number;
};

export interface ITeacherFilter {
  dateRange: string[];
  keyword: string;
  kdtId: string | number;
}

export interface IScheduleFilter {
  dateRange: string[];
  eduCourseName: string;
}

export interface ICourseFilter {
  courseType: number | string;
  courseTitle: string;
}

export interface IPageRquest {
  countEnabled: boolean;
  pageNumber: number;
  pageSize: number;
  sort: object;
}

export interface ILessonData {
  appointRule: number; // 预约规则 1：学员预约后才可上课 2：学员无需预约即可上课java.lang.Integer
  addressName: string; // 网店名称java.lang.String
  className: string; // 班级名称java.lang.String
  classroomName: string; // 教室名称java.lang.String
  eduCourseName: string // 课程名称java.lang.String
  kdtId: number; // kdtId
  lessonName: string; // 课节名称java.lang.String
  lessonTime: string; // 上课时间 2019-01-01 21:00-22:00 java.lang.String
  lessonCase: {
    hadSignInNum: number; // 正式课体验课已签到人数（包含到课，请假，旷课）
    hadCheckInNum: number; // 正式课体验课到课人数
    hadAppointNum: number; // 正式课已预约人数
    lessonStatus: number; // 上课状态 1：待上课 2：上课中 3：已上课java.lang.Integer
    shouldSignInNum: number; // 正式课体验课应到人数
    shouldAppointNum: number; // 可预约人数，排课时配置
    studentNum: number;
  }
  lessonNo: string; // 课节编号java.lang.String
  repeatType: number; // 循环配置类型 1 单次排课 2 按天重复 3 按周重复java.lang.Integer
  shopName: string; // 店铺名称java.lang.String
  scheduleId: number; // scheduleId
  teacherName: string;
}

export interface IFetchConditions {
  filterConditions: Partial<IScheduleFilter>,
  pageConditions: IPageRquest,
}

export interface IShopFucntion {
  getDefaultEduShopOption: () => void;
  onShopSelected: <T>(data: T, val: T) => void;
  getShopOptions: <T>(query: T, pageConditions: T) => Promise<T>;
}

export type TCourseData = {
  applyCourseType: number;
  applyCourseName: string;
  alias: string;
  courseType: number;
  createdAt: string;
  shortenUrl: string;
  id: number;
  kdtId: number;
  price: number;
  sellType: number; // (0, "自定义"), CLASS_HOUR(1, "按课时"), DATE_RANGE(2, "按时间段"), PERIOD(3, "按期"),java.lang.
  totalSoldNum: number;
  totalStock: number;
  title: string;
  sellStatus: string;
};

export type TTeacherDetailParams = {
  teacherNo: string;
  targetKdtId: number | null;
  teacherInfo: Partial<ITeacherInfo>;
};
