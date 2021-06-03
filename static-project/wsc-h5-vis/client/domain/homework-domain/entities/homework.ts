import Workbook, { IMediaBlock } from '@/domain/workbook-domain/entities/workbook';
import { IUserHomeworkDTO } from 'definitions/api/owl/api/UserExerciseFacade/getHomeworkDetail';

/** 评分风格枚举 */
enum HomeworkScoreStyleEnum {
  /** 分数制 */
  NUMBER = 1,
  /** 等第制 */
  GRADE = 2
}

/** 评分规则枚举 */
enum HomeworkScoreRuleEnum {
  /** 十分制 */
  TEN = 1,
  /** 百分制 */
  HUNDRED = 2
}

enum HomeworkStatusEnum {
  /** 上架 */
  ON_SHELF = 1,
  /** 下架 */
  OFF_SHELF = 2,
  /** 定时发布 */
  TIMER_PUBLISH = 3
}

/** 作业 */
export default class Homework {
  /** 作业别称 */
  alias: string;
  /** 作业标题 */
  title: string;
  /** (定时)发布时间 */
  publishTime: Date;
  /** 截止时间 */
  deadline?: Date;
  /** 作业详情 */
  detail: IMediaBlock[];
  /** 评分规则（十分制或百分制） */
  scoreRule?: HomeworkScoreRuleEnum;
  /** 评分机制 */
  scoreStyle: HomeworkScoreStyleEnum;
  /** 作业状态 */
  status: HomeworkStatusEnum;
  /** 相关作业本 */
  workbook: Workbook;
  /** 作业提交id */
  assignmentId: number;

  constructor(homework: IUserHomeworkDTO) {
    this.alias = homework.alias;
    this.title = homework.title;
    this.publishTime = new Date(homework.publishTime);
    this.deadline = new Date(homework.deadline);
    this.detail = homework.detail as unknown as IMediaBlock[];
    this.scoreRule = homework.scoreRule;
    this.scoreStyle = homework.scoreStyle;
    this.status = homework.status;
    this.assignmentId = homework.assignmentId;
    this.workbook = new Workbook(homework.exerciseBook);
  }

  /** 是否是分数制评分 */

  get isNumberStyle() {
    return this.scoreStyle === HomeworkScoreStyleEnum.NUMBER;
  }

  /** 是否是等第制评分 */

  get isGradeRule() {
    return this.scoreStyle === HomeworkScoreStyleEnum.GRADE;
  }

  /**
   * 前提条件：评分为分数制评分
   * 是否是十分制评分
   *
  */

  get isTenRule() {
    return this.scoreRule === HomeworkScoreRuleEnum.TEN;
  }

  /**
   * 前提条件：评分为分数制评分
   * 是否是百分制评分
   *
  */

  get isHundredRule() {
    return this.scoreRule === HomeworkScoreRuleEnum.HUNDRED;
  }

  /** 是否为上架状态 */

  get isOnShelf() {
    return this.status === HomeworkStatusEnum.ON_SHELF;
  }

  /** 是否为下架状态 */

  get isOffShelf() {
    return this.status === HomeworkStatusEnum.OFF_SHELF;
  }

  /** 是否为定时发布中状态 */

  get isTimerPublish() {
    return this.status === HomeworkStatusEnum.TIMER_PUBLISH;
  }

  /** 作业提交是否已截止 */

  get isOverTime() {
    if (this.deadline !== undefined &&
        Date.now() > this.deadline.getTime()) {
      return true;
    }

    return false;
  }
}
