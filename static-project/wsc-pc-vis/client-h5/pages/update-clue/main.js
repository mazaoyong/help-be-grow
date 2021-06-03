import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';
import App from './index.vue';

Vue.use(Vuex);

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  render: h => h(App),
});
