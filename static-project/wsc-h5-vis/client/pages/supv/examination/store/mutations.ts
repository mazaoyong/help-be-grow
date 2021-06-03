import { MutationTree, Mutation } from 'vuex';
import { AnswerMode } from 'supv/examination/types';
import { ExamState } from './state';

export interface ExamMutations extends MutationTree<ExamState> {
  updateExamId: Mutation<ExamState>;
  updateMode: Mutation<ExamState>;
  updateUserExamId: Mutation<ExamState>;
}

const mutations: ExamMutations = {
  updateExamId(state, examId: number) {
    state.examId = examId;
  },
  updateMode(state, mode: AnswerMode) {
    state.mode = mode;
  },
  updateUserExamId(state, userExamId: number) {
    state.userExamId = userExamId;
  },
};

export default mutations;
