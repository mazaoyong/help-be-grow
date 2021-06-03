import VueRouter from 'vue-router';

const routes = [
  {
    name: 'Img',
    path: './container/img.vue',
    component: () => import(/* webpackChunkName: 'edu/detail-container-img' */ './container/img'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
