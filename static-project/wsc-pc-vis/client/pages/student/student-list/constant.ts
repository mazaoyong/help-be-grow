import {
  getStudentListByBirthdayJson,
  getStudentListByRemainingHourNotEnoughJson,
  getStudentListByEndTimeNotEnoughJson,
  getStudentListByUnusedAssetJson,
} from '../api/student-list';

export type ICategoryEnum = 'birthday' | 'exhaust' | 'expire' | 'absent';
// 特殊类型学员列表
export const LIST_TYPE: Record<
ICategoryEnum,
{ title: string; api: (...arg: any[]) => Promise<any> }
> = {
  birthday: {
    title: '七天内生日的学员',
    api: getStudentListByBirthdayJson,
  },
  exhaust: {
    title: '课时即将用尽的学员',
    api: getStudentListByRemainingHourNotEnoughJson,
  },
  expire: {
    title: '课时即将到期的学员',
    api: getStudentListByEndTimeNotEnoughJson,
  },
  absent: {
    title: '七日内未上课的学员',
    api: getStudentListByUnusedAssetJson,
  },
};
