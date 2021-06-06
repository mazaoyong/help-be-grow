import { Module } from 'vuex';
import { ExamState } from 'supv/examination/store/state';
import state, { DetailState } from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

const module: Module<DetailState, ExamState> = {
  state,
  mutations,
  actions,
  getters,
};

export default module;