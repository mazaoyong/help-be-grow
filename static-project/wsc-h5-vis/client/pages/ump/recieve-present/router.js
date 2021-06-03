import Vue from 'vue';
import Router from 'vue-router';
import PresentList from './container/present-list';
import Student from './container/student';

Vue.use(Router);
const router = new Router({
  mode: 'history',
  base: '/wscvis/ump/receive-present',
  routes: [
    {
      name: 'index',
      path: '/',
      component: PresentList,
    },
    {
      name: 'student',
      path: '/student',
      component: Student,
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
});
export default router;
