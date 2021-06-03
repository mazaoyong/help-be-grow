import Vuex from 'vuex';
import Vue from 'vue';

import messages from './modules/messages';

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: {
  },
  modules: {
    messages,
  },
});

export default store;
