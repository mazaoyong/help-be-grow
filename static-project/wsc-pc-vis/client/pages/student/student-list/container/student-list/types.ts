import { IOption } from '@youzan/ebiz-components/es/types/easy-list';

enum Gender {
  FEMALE = 0,
  MALE
}

enum BooleanLike {
  False = 0,
  True,
}

interface IStudent {
  address: string;
  age: string;
  avatar: string;
  bornDate: string;
  campuses: any[];
  createUserId: number;
  customAttributeItems: any[];
  gender: Gender;
  grade: string;
  id: number;
  idCardNo: string;
  kdtId: number;
  lastClassTime: string;
  mobile: number | string;
  monthAge: string;
  name: string;
  school: string;
  studentNo: number;
  userId: number;
  wechatAccount: string;
}

interface IStudentState {
  description?: string;
  type: number;
}

interface ICourseTime {
  locked?: number;
  remaining?: number;
  reward?: number;
  total?: number;
  used?: number;
}

export interface IStudentListItem {
  student: IStudent;
  studentState: IStudentState;

  familyMemberCount: number;
  familyMemberNames: string[];
  familyMpFansNames: string[];

  hasSubMpCount: BooleanLike;

  courseTime: ICourseTime;

  eduCourseValidDescription: string;
}

export type StudentListCategory = 'birthday' | 'exhaust' | 'expire' | 'absent' | '';

export interface IStudentListState {
  loading: boolean,
  studentList: IStudentListItem[],
  filter: Record<string, any>,
  total: number,
  page: number,
  size: number,
  sortBy: string,
  sortType: 'desc' | 'asc',
  schoolSelectOpts: IOption[],
  category: StudentListCategory,
}
