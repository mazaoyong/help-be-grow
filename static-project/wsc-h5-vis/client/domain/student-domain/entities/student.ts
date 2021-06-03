/* eslint-disable jsdoc/require-returns */
/** 角色类型枚举 */
export enum RoleEnum{
  /** 客户 */
  CUSTOMER = 1,
  /** 学员 */
  STUDENT = 2,
}

/** 基础学员接口 */
export interface IBaseStudent {
  /** 学员id */
  userId: number;
  /** 姓名 */
  name: string;
  /** 头像 */
  avatar: string;
  /** 手机号 */
  mobile: string;
  /** 角色类型 */
  role: RoleEnum;
}

/** 学员 */
export default class Student {
  /** 学员id */
  id: number;
  /** 姓名 */
  name: string;
  /** 头像 */
  avatar: string;
  /** 手机号 */
  mobile: string;
  /** 角色类型 */
  role: RoleEnum;

  constructor(student: IBaseStudent) {
    this.id = student.userId;
    this.name = student.name;
    this.avatar = student.avatar;
    this.mobile = student.mobile;
    this.role = student.role === 1 ? RoleEnum.CUSTOMER : RoleEnum.STUDENT;
  }
}
