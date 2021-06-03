import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import store from 'store';
import App from './App';
import router from './router';

// 初始化路由
Vue.use(VueRouter);
Vue.use(Vuex);

// eslint-disable-next-line
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
