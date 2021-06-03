import VueRouter, { RouteConfig } from 'vue-router';
import Vue from 'vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/:alias',
    name: 'LandingPage',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/ump/tuition',
  routes,
});

export default router;
