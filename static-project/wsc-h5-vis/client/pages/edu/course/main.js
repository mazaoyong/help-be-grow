import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import routes from './routes';
import { initWXSdk } from '@youzan/wxsdk';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/edu/course',
  routes,
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
  render: h => h(App),
});
