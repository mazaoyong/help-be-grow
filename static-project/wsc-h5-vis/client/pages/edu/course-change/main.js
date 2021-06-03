import Vue from 'vue';
import App from './App.vue';
import store from './store';
import routes from './routes';
import VueRouter from 'vue-router';
import { initWXSdk } from '@youzan/wxsdk';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: 'history',
  base: '/wscvis/edu/course-change',
});

router.beforeEach((to, from, next) => {
  if (to.meta.hideCopyright) {
    const $copyright = document.querySelector('.footer');
    if ($copyright) {
      $copyright.style.display = 'none';
    }
  }
  if (!to.meta.needFetch) {
    document.title = to.meta.title;
  }

  /* eslint-enable */
  next();
});

initWXSdk({
  shareConfig: {
    notShare: true,
  },
});

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});
