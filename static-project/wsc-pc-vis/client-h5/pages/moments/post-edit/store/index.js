import Vuex from 'vuex';
import Vue from 'vue';
import moduleEdit from './modules/edit';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },

  actions: {
  },

  modules: {
    edit: moduleEdit,
  },
});

export default store;
