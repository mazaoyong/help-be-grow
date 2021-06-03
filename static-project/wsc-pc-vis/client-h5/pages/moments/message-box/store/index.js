import Vuex from 'vuex';
import Vue from 'vue';

import messages from './modules/messages';
import userInfo from '../../feeds/store/modules/userInfo';

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: {
  },
  modules: {
    messages,
    userInfo,
  },
});

export default store;
