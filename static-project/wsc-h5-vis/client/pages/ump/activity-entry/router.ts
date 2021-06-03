import VueRouter, { RouteConfig } from 'vue-router';
import Vue from 'vue';

// import ActivityList from './container/ActivityList.vue';
import Home from './container/Home.vue';
import Empty from './container/Empty.vue';

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/empty',
    name: 'empty',
    component: Empty,
  },
  /** @see https://gitlab.qima-inc.com/snippets/165 */
  // {
  //   path: '/:path',
  //   name: 'list',
  //   component: ActivityList,
  // },
];

const router = new VueRouter({
  mode: 'history',
  base: '/wscvis/ump/activity-entry',
  routes,
});

export default router;
