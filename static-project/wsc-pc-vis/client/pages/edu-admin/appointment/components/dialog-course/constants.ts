export interface ILessonError {
  code: number;
  message: string;// 暂不使用，用后端返回的reason字段
}

export const LessonErrorsCustomAsset: ILessonError = {
  code: 0,
  message: '自定义资产未设置有效期',
};
export const LessonErrorsPass: ILessonError = {
  code: 1,
  message: '校验通过',
};
export const LessonErrorsStudentIn: ILessonError = {
  code: 2,
  message: '学员已在本日程',
};
export const LessonErrorsExperied: ILessonError = {
  code: 3,
  message: '课程到期',
};
export const LessonErrorsLater: ILessonError = {
  code: 4,
  message: '资产生效时间晚于日程结束时间',
};
export const LessonErrorsNotEnough: ILessonError = {
  code: 5,
  message: '课时不足',
};
export const LessonErrorsSginIn: ILessonError = {
  code: 6,
  message: '签到后生效',
};
export const LessonErrorsNoQuota: ILessonError = {
  code: 7,
  message: '剩余名额为0',
};
export const LessonErrorsNoQuotaContinue: ILessonError = {
  code: 8,
  message: '名额已满，是否继续预约',
};

// 课节不可选具体原因
export const LessonErrors: Array<ILessonError> = [
  LessonErrorsCustomAsset,
  LessonErrorsPass,
  LessonErrorsStudentIn,
  LessonErrorsExperied,
  LessonErrorsLater,
  LessonErrorsNotEnough,
  LessonErrorsSginIn,
  LessonErrorsNoQuota,
];

export const styleNamePrefix: string = 'dialog-course';

// 全部选项时的ID
export const allOptionId: number = -1;

// 课程类型
export const CourseType = {
  experienceLesson: 0, // 体验课
  formalLesson: 1, // 正式课
};

// 一天的毫秒数
export const ONEDAY: number = 24 * 60 * 60 * 1000;

// 当前日期的date对象
export const dateNow: Date = new Date();

// 默认分页参数
export const defaultPageInfo = {
  total: 0,
  pageSize: 5,
  current: 1,
};

// 课程选项
export const allCourseOption = {
  text: '全部课程',
  value: allOptionId,
};

// 地点全部
export const allAddressOption = {
  text: '全部上课地点',
  value: allOptionId,
};
