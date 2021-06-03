import { GetterTree, Getter } from 'vuex';
import { AnswerMode } from '../types';
import { ExamState } from './state';

interface ExamGetters extends GetterTree<ExamState, any> {
  inPreview: Getter<ExamState, ExamState>;
  inAnswer: Getter<ExamState, ExamState>;
  inReview: Getter<ExamState, ExamState>;
}

const getters: ExamGetters = {
  inPreview(state) {
    return state.mode === AnswerMode.PREVIEW;
  },
  inAnswer(state) {
    return state.mode === AnswerMode.ANSWER;
  },
  inReview(state) {
    return state.mode === AnswerMode.REVIEW;
  },
};

export default getters;
