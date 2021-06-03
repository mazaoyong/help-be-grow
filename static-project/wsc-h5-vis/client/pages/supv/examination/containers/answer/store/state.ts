import { AnswerMode, QuestionType } from 'supv/examination/types';

export interface QuestionItem {
  id: number;
  completed: boolean;
}
interface Option {
  id: number | string;
  no: string;
  content: string;
}
export interface IBlank {
  mode: AnswerMode;
  correct: boolean;
  incorrect: boolean;
  label: string;
  value: string;
  placeholder: string;
}
export type Question = IQuestion | null;
export interface IQuestion {
  id?: number;
  type?: QuestionType;
  no?: number;
  score?: number;
  content?: string;
  options?: Option[];
  blankCount?: number;
  correct?: boolean;
  correctAnswer?: string[];
  userAnswer?: any[];
  userScore?: number;
  reviewContent?: string;
  reference?: string; // 参考答案
}
export interface AnswerState {
  userScore: number;
  remainMS: number;
  questionList: Question[];
  currentQuestion: Question;
  userAnswer: string[] | boolean | string | null;
  reference: string; // 参考答案
  showAnswerCardPopup: boolean;
  started: boolean;
  hasPrev: boolean;
  hasNext: boolean;
  isSaving: boolean;
  isReviewing: boolean;
}

const state: AnswerState = {
  userScore: 0,
  remainMS: 100000000,
  questionList: [],
  currentQuestion: {},
  userAnswer: null,
  reference: '',
  showAnswerCardPopup: false,
  started: false,
  hasPrev: true,
  hasNext: true,
  isSaving: false,
  isReviewing: false,
};

export default state;
