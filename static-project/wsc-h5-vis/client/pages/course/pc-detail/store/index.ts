import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

export { PcDetailState } from '../types/vuex';

Vue.use(Vuex);

const rootStore = {
  state,
  getters,
  actions,
  mutations,
};

const store = new Vuex.Store(rootStore);

export default store;
