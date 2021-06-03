// 0： 不冲突; 1: 老师冲突; 2: 班级冲突; 3: 教室冲突;
export type conflictType = '0' | '1' | '2' | '3' | '1,2' | '1,3' | '2,3' | '1,2,3';

export type IScheduleViewProps = 'timeline' | 'teacher' | 'classroom' | 'class';

// 日程视图单元
export interface IViewCellData {
  date: string; // 开课日期
  repeatType?: 1 | 2 | 3; // 循环配置类型 1 单次排课 2 按天重复 3 按周重复
  startTime: number; // 上课开始时间
  endTime: number; // 上课结束时间
  className: string; // 班级名称
  classroomName: string; // 教室名称
  lessonNo: string; // 课节编号
  lessonName: string; // 课节名称
  conflictResources: conflictType;
  addressName?: string; // 网店名称
  shopName?: string; // 校区名称
  appointNumLeft: number; // 剩余名额
  eduCourseName: string; // 课程名称
  teacherName: string; // 老师名称
  appointRule: 0 | 1; // 预约规则 1：学员预约后才可上课 2：学员无需预约即可上课
  isTrial: 0 | 1 | -1; // 是否为预约试听
  lessonTime?: string; // 列表上课时间
  scheduleId: number; // 排课 id
  lessonCase: {
    shouldSignInNum: number; // 应签到人数
    hadSignInNum: number; // 已签到人数
    hadAppointNum: number; // 正式课已预约人数
    shouldAppointNum: number; // 可预约人数
    hadCheckInNum: number;
  };
  kdtId: number; // 校区 id
  assistantNames: string[];
}

// 日程视图接口
export interface IViewData {
  [key: string]: IViewCellData[];
}

export type sortType = '' | 'ASC' | 'DESC';

export type IGridSortType = '' | 'asc' | 'desc';

interface ISortData {
  orders: { property: string, direction: sortType }[];
}

// 列表视图接口

export interface IListData {
  total: number;
  content: IViewCellData[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: ISortData; // 排序方式
  };
}

// 操作结果
export interface IActionResult {
  actionKey: string;
  message: string;
  singleActionStatus: number;
}

export interface IResultDetailProp {
  result: IActionResult[];
  total: number;
  userSelected: IViewCellData[]; // 后端接口现没有支持”日程编号 - 日程名称“关联
};
