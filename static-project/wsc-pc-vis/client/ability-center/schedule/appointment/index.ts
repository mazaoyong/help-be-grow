// 预约状态 0 全部 1 待确认 2 待上课 3 已上课 4 已取消
export enum AppointmentStatus {
  All = 0,
  needConfirm = 1,
  needAttendClass = 2,
  alreadyAttendClass = 3,
  alreadyCanceled = 4
}

// 线下课类型 0 体验课 1 正式课
export enum CourseType {
  experience = 0,
  formal = 1
}

export interface INavigateToAppointmentOption {
  // 是否需要添加弹框
  add?: boolean;
  // 学员编号
  studentNo?: string;
  // 列表展示所选预约状态
  status?: AppointmentStatus;
  // 筛选项老师名称
  teacherName?: string;
  // 筛选项线下课类型
  courseType?: CourseType;
}

export function navigateToAppointment(option: INavigateToAppointmentOption) {
  const prefix = `${window._global.url.v4}/vis/edu/page/appointment#/list`;
  const query = Object.keys(option).reduce((prev, cur) => {
    const key = cur;
    const value = cur === 'add' ? Number(option[key]) : option[key];
    prev += `&${key}=${value}`;
    return prev;
  }, '');
  if (query.length > 0) {
    return prefix + '?' + query.slice(1);
  }
  return prefix;
}
