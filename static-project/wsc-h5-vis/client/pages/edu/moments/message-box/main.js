import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './index.vue';
import store from './store';
import { Notify } from 'vant';

Vue.use(Notify);
Vue.use(VueRouter);

const routes = [
  {
    path: '/detail/:postId',
    template: App,
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
