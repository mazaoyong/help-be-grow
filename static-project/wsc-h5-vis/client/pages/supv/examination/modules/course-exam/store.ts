import { Module } from 'vuex';
import { hasExam } from './utils';

const store: Module<any, any> = {
  state: {
    hasExam: false,
    examInfo: {},
  },
  mutations: {
    updateHasExam(state, hasExam: boolean) {
      state.hasExam = hasExam;
    },
    updateExamInfo(state, examInfo: any) {
      state.examInfo = examInfo;
    },
  },
  actions: {
    fetchCourseExam({ commit }, alias) {
      hasExam(alias)
        .then(data => {
          commit('updateHasExam', true);
          commit('updateExamInfo', data);
        })
        .catch(() => {
          commit('updateHasExam', false);
        });
    },
  },
};

export default store;
