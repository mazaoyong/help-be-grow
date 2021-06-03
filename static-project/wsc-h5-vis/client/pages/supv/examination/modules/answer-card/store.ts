import { Module } from 'vuex';
import { IAnswerCard, AnswerMode } from 'supv/examination/types';
import { getAnswerCard } from './apis';
import { Toast } from 'vant';

interface AnswerCardState {
  answerCard: IAnswerCard;
  showAnswerPopup: boolean;
}

const store: Module<AnswerCardState, any> = {
  state: {
    answerCard: {
      correctNum: 0,
      errorNum: 0,
      questionCount: 0,
      questions: [],
      subjectNum: 0,
      unansweredNum: 0,
      userScore: 0,
      paperState: 1,
    },
    showAnswerPopup: false,
  },

  mutations: {
    updateAnswerCard(state, answerCard: IAnswerCard) {
      state.answerCard = answerCard;
    },
    updateShowAnswerPopup(state, show: boolean) {
      state.showAnswerPopup = show;
    },
  },

  getters: {
    isReviewing(state) {
      return state.answerCard.paperState === 1;
    },

    sumCount(state) {
      return state.answerCard.questionCount;
    },

    answerList(state) {
      return state.answerCard.questions;
    },

    userScore(state) {
      return state.answerCard.userScore;
    },

    completedCount(state, getters, rootState) {
      if (rootState.mode === AnswerMode.PREVIEW) {
        return 0;
      }
      return state.answerCard.questionCount - state.answerCard.unansweredNum;
    },
  },

  actions: {
    fetchAnswerCard: {
      root: true,
      handler({ rootState, commit }) {
        getAnswerCard({
          examId: rootState.examId,
          userExamId: rootState.userExamId,
          visitMode: rootState.mode,
        })
          .then(res => {
            if (res) {
              commit('updateAnswerCard', res.answerCard);
            } else {
              Toast('获取答题卡信息失败');
            }
          })
          .catch(errMsg => Toast(errMsg));
      },
    },
  },
};

export default store;
