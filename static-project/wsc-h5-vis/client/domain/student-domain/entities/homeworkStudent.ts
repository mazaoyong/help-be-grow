import Student, { IBaseStudent } from './student';

/** 作业业务学员信息 */
export interface IHomeworkStudent extends IBaseStudent {}

/** 作业业务学员 */
export default class HomeworkStudent extends Student {}
