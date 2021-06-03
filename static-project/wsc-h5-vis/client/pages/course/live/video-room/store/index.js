import Vue from 'vue';
import Vuex from 'vuex';

import state from './state';
import actions from './action';
import mutations from './mutation';
import getters from './getter';

Vue.use(Vuex);

const rootState = {
  state,
  actions,
  mutations,
  getters,
};

const store = new Vuex.Store(rootState);

export default store;
