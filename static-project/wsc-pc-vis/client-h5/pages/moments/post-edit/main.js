import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './index.vue';
import routes from './routes';
import store from './store';

// 初始化路由
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  base: '/v4/vis/h5/edu/moments/post-edit/',
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const query = to.query;
  store.commit('edit/CHANGE_ARGS', query);
  next();
});

// eslint-disable-next-line
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
