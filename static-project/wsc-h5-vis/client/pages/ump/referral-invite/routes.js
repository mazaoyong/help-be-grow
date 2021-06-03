
const routes = [
  {
    name: 'home',
    path: '/',
    component: () => import(/* webpackChunkName: 'ump/referral-invite/home' */ './container/home/App.vue'),
  },
  {
    name: 'profit',
    path: '/profit',
    component: () => import(/* webpackChunkName: 'ump/referral-invite/profit' */ './container/profit/App.vue'),
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default routes;
