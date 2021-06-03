import { MutationTree, Mutation } from 'vuex';
import { ResultState } from './state';
import { ExamResultStatus, ExamStatus } from 'supv/examination/types';

export interface ResultMutations extends MutationTree<ResultState> {
  updateStatus: Mutation<ResultState>;
  updateExamStatus: Mutation<ResultState>;
  updateStudentName: Mutation<ResultState>;
  updateStudentScore: Mutation<ResultState>;
  updateCompletedTime: Mutation<ResultState>;
  updateShowAnswerCard: Mutation<ResultState>;
  updateShowMpQrcode: Mutation<ResultState>;
  updateCanReexam: Mutation<ResultState>;
  updateReexamLeftSeconds: Mutation<ResultState>;
  updateCanJoinExam: Mutation<ResultState>;
  updateQrcode: Mutation<ResultState>;
  updatePublishStatus: Mutation<ResultState>;
  updateReexamStudentId: Mutation<ResultState>;
}

const mutations: ResultMutations = {
  updateStatus(state, payload: ExamResultStatus) {
    state.status = payload;
  },
  updateExamStatus(state, payload: ExamStatus) {
    state.examStatus = payload;
  },
  updateStudentName(state, payload: string) {
    state.studentName = payload;
  },
  updateStudentScore(state, payload: number) {
    state.studentScore = payload;
  },
  updateCompletedTime(state, payload: number) {
    state.completedTime = payload;
  },
  updateShowAnswerCard(state, payload: boolean) {
    state.showAnswerCard = payload;
  },
  updateShowMpQrcode(state, payload: boolean) {
    state.showMpQrcode = payload;
  },
  updateCanReexam(state, payload: boolean) {
    state.canReexam = payload;
  },
  updateReexamLeftSeconds(state, payload: number) {
    state.reexamLeftSeconds = payload;
  },
  updateCanJoinExam(state, payload: boolean) {
    state.canJoinExam = payload;
  },
  updateQrcode(state, payload: string) {
    state.qrcode = payload;
  },
  updatePublishStatus(state, payload: 1 | 2) {
    state.publishStatus = payload;
  },
  updateReexamStudentId(state, payload: number) {
    state.reexamStudentId = payload;
  },
};

export default mutations;
