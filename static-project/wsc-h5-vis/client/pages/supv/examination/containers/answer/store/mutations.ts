import { MutationTree, Mutation } from 'vuex';
import { AnswerState, Question } from './state';

export interface AnswerMutations extends MutationTree<AnswerState> {
  updateRemainMS: Mutation<AnswerState>;
  updateCurrentQuestion: Mutation<AnswerState>;
  updateQuestionList: Mutation<AnswerState>;
  updateUserAnswer: Mutation<AnswerState>;
  updateReference: Mutation<AnswerState>;
  updateAnswerCardPopup: Mutation<AnswerState>;
  updateStarted: Mutation<AnswerState>;
  updateIsSaving: Mutation<AnswerState>;
  updateReviewing: Mutation<AnswerState>;
}

const mutations: AnswerMutations = {
  updateRemainMS(state, remainMS: number) {
    state.remainMS = remainMS;
  },
  updateCurrentQuestion(state, question: Question) {
    state.currentQuestion = question;
  },
  updateQuestionList(state, question: Question) {
    if (state.questionList.length) {
      state.questionList.shift();
      state.questionList.push(question);
    } else {
      state.questionList.push(question);
    }
  },
  updateUserAnswer(state, userAnswer: string[] | boolean | string) {
    state.userAnswer = userAnswer;
  },
  updateReference(state, payload: string) {
    state.reference = payload;
  },
  updateAnswerCardPopup(state, showPopup: boolean) {
    state.showAnswerCardPopup = showPopup;
  },
  updateStarted(state, started: boolean) {
    state.started = started;
  },
  updateHasPrev(state, hasPrev: boolean) {
    state.hasPrev = hasPrev;
  },
  updateHasNext(state, hasNext: boolean) {
    state.hasNext = hasNext;
  },
  updateIsSaving(state, isSaving: boolean) {
    state.isSaving = isSaving;
  },
  updateReviewing(state, isReviewing: boolean) {
    state.isReviewing = isReviewing;
  },
};

export default mutations;
