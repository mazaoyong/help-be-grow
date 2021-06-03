import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import router from './router';
import App from './index.vue';
import store from './store';

Vue.use(Vuex);
Vue.use(VueRouter);

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
