import HomeworkStudent from '@/domain/student-domain/entities/homeworkStudent';

import { IReviewerDTO, IStudentBriefDTO } from 'definitions/api/owl/api/UserExerciseFacade/findUserAssignmentPage';
import { IExerciseBookDTO, IExerciseDetailItemDTO, IHomeworkDTO, IHomeworkReviewDTO } from 'definitions/api/owl/api/UserExerciseFacade/getStudentAssignment';

/** 评分风格枚举 */
export enum HomeworkScoreStyleEnum {
  /** 分数制 */
  NUMBER = 1,
  /** 等第制 */
  GRADE = 2
}
interface IAssignment {
  /** 发布时间 */
  publishTime?: string;
  /** 作业本id */
  exerciseBookId?: number;
  /** 店铺id */
  kdtId: number;
  /** 批阅人 */
  reviewer?: IReviewerDTO;
  /** 作业标题 */
  title?: string;
  /** 学生作业的作业id */
  assignmentId: number;
  /** 成绩 */
  score?: string;
  /** 作业id */
  homeworkId?: number;
  /** 学员信息 */
  studentDTO: IStudentBriefDTO;
  /** 提交时间 */
  submitTime: string;
  /**
   * 作业排名
   *  是否是优秀
   *  1: 是
   *  0: 不是
   */
  excellentScore?: number;
  /**
   * 是否退出了作业本
   *  1： 是
   *  0： 否
   */
  studentStatus: number;
  /**
   * 作业的状态
   *  11：未提交
   *  21：已提交/未批阅
   *  31：已批阅
   */
  status?: number;
  /**
   * 截止时间
   */
  deadline?: number;
  /**
   * 评分风格，分数制/等第制
   */
  scoreStyle?: HomeworkScoreStyleEnum;
  /** 用户的答案 */
  answerDetail?: Array<IExerciseDetailItemDTO>;
  /** 答案的草稿 */
  answerDraft?: Array<IExerciseDetailItemDTO>;
  /** 是否已批阅 */
  hasReviewed?: boolean;
  /** 其他学员的头像，最多查询4个 */
  otherStudentList?: Array<IStudentBriefDTO>;
  /** 作业信息 */
  homework?: IHomeworkDTO;
  /** 作业的评语信息 */
  reviewDTO?: IHomeworkReviewDTO;
  /** 作业本信息 */
  exercise?: IExerciseBookDTO;
}

export enum AssignmentStatusEnum {
  /** 未提交 */
  UNCOMMIT = 11,
  /** 已提交/未批阅 */
  COMMITED = 21,
  /** 已批阅 */
  CORRECTED = 31
}

/**
 * 学员作业
 */
export default class Assignment {
  /** 学员作业id */
  id: number;
  /** 提交时间 */
  submitTime: Date;
  /** 学员信息 */
  studentInfo: HomeworkStudent;
  /** 批改信息 */
  correctInfo: {
    isExcellentHomework: boolean;
    /** 格式化之后的分数 */
    grade?: string;
  };
  /** 相关的作业信息 */
  homeworkInfo: {
    id: number;
    title: string;
    // publishTime: Date;
    deadline?: Date;
  };
  // status: AssignmentStatusEnum;

  constructor(assignment: IAssignment) {
    this.id = assignment.assignmentId;
    this.submitTime = new Date(assignment.submitTime);
    this.studentInfo = new HomeworkStudent(assignment.studentDTO);
    this.correctInfo = {
      isExcellentHomework: Boolean(assignment.excellentScore),
    };
    this.homeworkInfo = {
      id: assignment.assignmentId,
      title: assignment.title ? assignment.title : '',
      // publishTime: assignment.publishTime ? new Date(assignment.publishTime),
      deadline: assignment.deadline ? new Date(assignment.deadline) : undefined,
    };
    // this.status = assignment.status;
  }

  /** 是否未提交 */

  // get isUncommit() {
  //   return this.status === AssignmentStatusEnum.UNCOMMIT;
  // }

  /** 是否已提交未批改 */

  // get isCommited() {
  //   return this.status === AssignmentStatusEnum.COMMITED;
  // }

  /** 是否已批改 */

  // get isCorrected() {
  //   return this.status === AssignmentStatusEnum.CORRECTED;
  // }
}
