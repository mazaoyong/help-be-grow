import Vue from 'vue';
import Vuex from 'vuex';
import store from 'store';
import router from './router';
import App from './index.vue';

Vue.use(Vuex);

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
