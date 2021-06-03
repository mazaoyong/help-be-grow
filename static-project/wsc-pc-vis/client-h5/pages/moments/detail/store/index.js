import Vuex from 'vuex';
import Vue from 'vue';

import feeds from '../../feeds/store/modules/feeds';
import userInfo from '../../feeds/store/modules/userInfo';

Vue.use(Vuex);

const store = new Vuex.Store({
  mutations: {
  },
  modules: {
    feeds,
    userInfo,
  },
});

export default store;
