import VueRouter from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/answer/',
    redirect: '/answer/preview',
  },
  {
    path: '/',
    redirect: '/invalid',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/supv/examination',
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.hideCopyright) {
    const $copyright = document.querySelector('.footer .copyright') as any;
    if ($copyright) {
      $copyright.style.visibility = 'hidden';
    }
  }
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
