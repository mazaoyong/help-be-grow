import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import state from './state';
import mutations from './mutations';
import getters from './getters';
import { IState } from '../types/store';

Vue.use(Vuex);

export default new Vuex.Store<IState>({
  state,
  mutations,
  getters,
  actions,
});
