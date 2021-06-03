import { ReactNode } from 'react';

/** 题型的统计信息 */
export type IStatistics = {
  /** 已答数量 */
  answeredCount: number;
  /** 答对数量 */
  correctCount: number;
  /** 漏答数量 */
  unansweredCount: number;
  /** 答错数量 */
  faultCount: number;
  /** 该部分题型的总分 */
  totalScore: number;
};

/** 答卷的基本信息 */
export interface IBasicInfo {
  /** 答卷所属考试的标题 */
  title: string;
  /** 答卷开始时间 （毫秒级时间戳） */
  startTime: number;
  /** 答卷提交时间 （毫秒级时间戳） */
  submitTime: number;
  /** 考生的姓名 */
  username: string;
}

/** 题目板块头部统计配置（已答、未答、漏答等） */
export interface IAnswerPartStatistics {
  /** 标签，如「已答」 */
  text: string;
  /** 数字 */
  value: number;
  /** 颜色 */
  type?: 'correct' | 'wrong' | 'normal';
}

/** 题目板块组件的 Props */
export interface IAnswerPartProps {
  /** 标题 */
  title: string | ReactNode;
  /** 副标题 */
  subtitle?: string | ReactNode;
  /** 分数 */
  score: number;
  /** 统计配置 */
  statistics: IAnswerPartStatistics[];
  /** 是否默认展开 */
  defaultExpand?: boolean;
  /** 板块内的题目列表 */
  questions: any;
  /** 当题目的评语或分数产生变化后的回调 */
  onQuestionChange?: any;
}
