import { Module } from 'vuex';
import { ExamState } from 'supv/examination/store/state';
import state, { AnswerState } from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const module: Module<AnswerState, ExamState> = {
  state: () => (Object.assign({}, state)),
  mutations,
  actions,
  getters,
};

export default module;
