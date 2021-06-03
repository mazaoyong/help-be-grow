import { QuestionType, QuestionLevel } from '../types';

// 考试状态
export enum ExamStatus {
  PUB = 1, // 已发布
  UNPUB, // 未发布
}

// 考试发布类型
export enum ExamPublishType {
  PUBLISH = 1, // 立即发布
  TIMER, // 定时发布
  REVOKE, // 暂不发布
}

// 考试限考类型
export enum ExamLimitType {
  LIMIT = 1, // 限制
  NO_LIMIT, // 不限制
}

// 考试有效期类型
export enum ExamValidityType {
  FOREVER = 1, // 长期有效
  TIME_LIMIT, // 限时有效
}

// 考试答案展示类型
export enum ExamAnswerDisplayType {
  AFTER_COMMIT = 1, // 提交考试后立即展示
  AFTER_REVIEW, // 提交且批阅完成后展示
  HIDE, // 隐藏
}
// @see https://doc.qima-inc.com/pages/viewpage.action?pageId=280217378
export enum MultiSelectQuestionRules {
  LOSS_SCORE = 2, // 少选得分
  OPTION_SCORE = 3, // 按选项得分
}

export enum FillBlankQuestionRules {
  AVERAGE_SCORE = 53, // 每项得分
};

export type QuestionRule = MultiSelectQuestionRules | FillBlankQuestionRules;

// 考试状态
export enum ReviewStatus {
  NOT_REVIEWED = 1, // 未批阅
  REVIEWED, // 已批阅
}

// 题目选项
export interface IOptions {
  content: string;
  optionId?: string;
  chosenRate?: number;
}

// 题目规则
export interface IGrading {
  rules: number[];
  score: number;
}

// 题目实体
export interface IQuestion {
  id: number;
  score: number;
  title: string;
  type: QuestionType;
  level: QuestionLevel;
  options?: IOptions[];
  answers?: string[];
  analysis?: string;
  grading?: IGrading;
}

// 题目控制信息实体
export interface IQuestionControl {
  type: QuestionType;
  count: number;
  perScore: number;
  totalScore: number;
  rule?: QuestionRule;
  ruleScore?: number;
}
