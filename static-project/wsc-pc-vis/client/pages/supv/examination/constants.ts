import { MultiSelectQuestionRules } from './types';

// 题目场景
export const QuestionScene = {
  EDITSCORE: Symbol('editScore'), // 编辑分数
  REVIEW: Symbol('review'), // 批阅
  STATISTICS: Symbol('statistics'), // 统计
};

// 默认每题得分
export const DefaultQuestionScore = 0;

// 多选题规则选项
export const multiScoreCondition = [
  { text: '少选得分', value: MultiSelectQuestionRules.LOSS_SCORE },
  { text: '按选项得分', value: MultiSelectQuestionRules.OPTION_SCORE },
];

// 分数精度
export const SCORE_DECIMAL = 2;

// 分数转换的乘数
export const SCORE_MULTIPLIER = 10 ** SCORE_DECIMAL;

// 每道题目最小分数
export const MIN_QUESTION_SCORE = 0;

// 每道题目最大分数
export const MAX_QUESTION_SCORE = 9999.99;

export enum GENDER {
  NONE = 0,
  MALE,
  FEMALE,
}

export const SAM_NAME = {
  EDIT_EXAM: '【考试】创建/编辑考试',
  REVIEW: '【考试】批阅试卷',
};

export const APPID = 50259;
