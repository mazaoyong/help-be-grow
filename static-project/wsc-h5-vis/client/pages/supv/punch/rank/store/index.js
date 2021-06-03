import Vue from 'vue';
import Vuex from 'vuex';
import rank from './modules/rank';
import calendar from './modules/calendar';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    rank,
    calendar,
  },
});
