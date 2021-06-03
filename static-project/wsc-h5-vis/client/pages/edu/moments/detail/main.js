import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './index.vue';
import store from './store';
import { Notify } from 'vant';

Vue.use(Notify);
Vue.use(VueRouter);

const routes = [
  {
    path: '/:postId',
    template: App,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/edu/moments/feeds/detail',
  routes,
});

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
