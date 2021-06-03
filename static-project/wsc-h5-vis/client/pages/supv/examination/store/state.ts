import { AnswerMode } from 'supv/examination/types';

export interface ExamState {
  examId: number;
  userExamId: number;
  mode: AnswerMode;
}

const state: ExamState = {
  examId: 0,
  userExamId: 0,
  mode: AnswerMode.PREVIEW,
};

export default state;
