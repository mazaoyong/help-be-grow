import Vuex from 'vuex';
import Vue from 'vue';

import userInfo from './modules/userInfo';
import notifications from './modules/notifications';
import feeds from './modules/feeds';

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: {
  },
  modules: {
    userInfo,
    notifications,
    feeds,
  },
});

export default store;
