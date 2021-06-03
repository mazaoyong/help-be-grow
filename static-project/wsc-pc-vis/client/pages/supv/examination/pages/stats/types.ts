import { IQuestionBaseEntity, IAnswerEntity } from '../../api';
import { IOptions } from '../../types';

export interface IBlockBaseProps {
  examTemplateId : number;
}

/** 考试基础统计信息 */
export interface IStatsOverviewData {
  /** 时长 */
  duration?: number;
  /** 已提交人数 */
  submitted?: number;
  /** 考试次数 */
  limitTimes?: number;
  /** 考试次数类型 2 不限制 1 限制 取 limitTimes */
  limitType?: 1 | 2;
  /** 未批阅人数 */
  unreviewed?: number;
  /** 最低分 */
  lowestScore?: number;
  /** 最高分 */
  highestScore?: number;
  /** 已批阅人数 */
  reviewed?: number;
  /** 考试名称 */
  title?: string;
  /** 总分 */
  totalScore?: number;
  /** 未提交人数 */
  unsubmitted?: number;
  /** 平均分 */
  averageScore?: number;
}

export enum SubmitStatus {
  ALL= -1,
  UN_SUBMIT = 1,
  SUBMITED = 2
}

export interface IExamQuestionStatistics {
  /** 正确率 */
  correctRate: number;
  question: IQuestionBaseEntity;
  answer: IAnswerEntity;
  serialNo: number;
}

/** 填空题选项选择率数据 */
export interface IFillblankOptionsChosenRate{
  /** 填空题题目空的内容 */
  answer: string;
  /** 选择率 */
  answerRightRate: number;
}

/** 判断题选项选择率数据 */
export interface IJudgeOptionsChosenRate{
  /** 答「正确」的选择率 */
  chosenRightRate: number;
  /** 答「错误」的选择率 */
  chosenWrongRate: number;
  /** 正确选项是？ */
  isRight: boolean;
}

/** 单选/多选选择率数据 */
export interface ICommonOptionsChosenRate{
  /** 选择率 */
  chosenRate: number;
  /** 这个选项是否是正确选项 */
  isCorrect: boolean;
  /** 选项数据 */
  option: IOptions;
}

export interface IQuetionOptionsChosenRate {
  examQuestion: IQuestionBaseEntity;
  examAnswer: IAnswerEntity;
  questionOptionStatisticsDTOList: ICommonOptionsChosenRate[];
  questionJudgeStatisticsDTO: IJudgeOptionsChosenRate;
  questionFillStatisticsDTOList: IFillblankOptionsChosenRate[];
}

export interface IExamStatsChartDataItem {
  higherScore: number;
  lowerScore: number;
  studentNumber: number;
}
