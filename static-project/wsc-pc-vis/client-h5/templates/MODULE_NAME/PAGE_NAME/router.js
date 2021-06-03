import VueRouter from 'vue-router';

const routes = [
  {
    name: 'a',
    path: './container/a',
    component: () => import(/* webpackChunkName: 'edu/route-a' */ './container/A'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
