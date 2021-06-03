export interface IAppointmentConfigDTO extends Record<string, number | undefined> {
  canCancelAppointmentHour?: number; // 开课前几个小时可以取消预约
  isAppointmentLimit: 0 | 1; // 预约规则，1为限制、0为不限制
  isIndependentConfig: 0 | 1; // 日程独立配置预约规则 0: 日程不独立配置预约规则 1: 独立
  isCancelAppointment: 0 | 1; // 是否允许取消预约 1为可以，0为不可以
  kdtId?: number;
  stopAppointmentHour?: number; // 开课前几个小时不能预约
  startAppointmentDay?: number; // 开课前几天可以预约
  trialCourseOccupyQuota: 0 | 1; // 试听课是否占用日程名额 1:占用名额，0:不占用名额
};
