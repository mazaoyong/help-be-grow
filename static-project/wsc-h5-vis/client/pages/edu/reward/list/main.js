import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './route';
import App from './App.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/edu/reward/list',
  routes,
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App),
});
