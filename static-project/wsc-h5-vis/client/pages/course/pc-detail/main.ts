import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';
import '@/pages/course/detail/common/vuex-helper';
import App from './App.vue';

document.title = store.state.goodsData.title;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/course/detail',
  routes: [{
    path: '/:alias',
    component: App,
  }],
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition || { x: 0, y: 0 };
  },
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app');
