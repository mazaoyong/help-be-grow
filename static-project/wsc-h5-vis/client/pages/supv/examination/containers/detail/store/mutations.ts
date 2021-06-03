import { MutationTree, Mutation } from 'vuex';
import { DetailState } from './state';

export interface DetailMutations extends MutationTree<DetailState> {
  updateValid: Mutation<DetailState>;
  updateCoverUrl: Mutation<DetailState>;
  updateTitle: Mutation<DetailState>;
  updateDuration: Mutation<DetailState>;
  updateQuestionCount: Mutation<DetailState>;
  updateUserAvatars: Mutation<DetailState>;
  updateScore: Mutation<DetailState>;
  updateDetail: Mutation<DetailState>;
  updateStatus: Mutation<DetailState>;
  updateUserExamStatus: Mutation<DetailState>;
  updateCanJoinExam: Mutation<DetailState>;
  updateHasLimit: Mutation<DetailState>;
  updateStudentIds: Mutation<DetailState>;
  updateLeftSeconds: Mutation<DetailState>;
  updateCanReexam: Mutation<DetailState>;
  updateReexamLeftSeconds: Mutation<DetailState>;
  updateInfoCollectorSettings: Mutation<DetailState>;
  updatePublishStatus: Mutation<DetailState>;
}

const mutations: DetailMutations = {
  updateValid(state, valid: boolean) {
    state.valid = valid;
  },
  updateCoverUrl(state, coverUrl: string) {
    state.coverUrl = coverUrl;
  },
  updateTitle(state, title: string) {
    state.title = title;
  },
  updateDuration(state, duration: number) {
    state.duration = duration;
  },
  updateQuestionCount(state, questionCount: number) {
    state.questionCount = questionCount;
  },
  updateUserAvatars(state, userAvatars: string[]) {
    state.userAvatars = userAvatars;
  },
  updateScore(state, score: number) {
    state.score = score;
  },
  updateDetail(state, detail: string) {
    state.detail = detail;
  },
  updateStatus(state, status: number) {
    state.status = status;
  },
  updateUserExamStatus(state, userExamStatus: number) {
    state.userExamStatus = userExamStatus;
  },
  updateCanJoinExam(state, canJoinExam: boolean) {
    state.canJoinExam = canJoinExam;
  },
  updateHasLimit(state, hasLimit: boolean) {
    state.hasLimit = hasLimit;
  },
  updateStudentIds(state, studentIds: number[]) {
    state.studentIds = studentIds;
  },
  updateLeftSeconds(state, leftSeconds: number) {
    state.leftSeconds = leftSeconds;
  },
  updateCanReexam(state, canReexam: boolean) {
    state.canReexam = canReexam;
  },
  updateReexamLeftSeconds(state, reexamLeftSeconds: number) {
    state.reexamLeftSeconds = reexamLeftSeconds;
  },
  updateInfoCollectorSettings(state, settings: any[]) {
    state.infoCollectorSettings = settings;
  },
  updatePublishStatus(state, publishStatus: 1 | 2) {
    state.publishStatus = publishStatus;
  },
};

export default mutations;
