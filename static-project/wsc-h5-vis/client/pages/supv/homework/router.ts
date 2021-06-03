import { createRoute, createRouter } from '@youzan/tany-vue';

export const workbookRoute = createRoute({
  path: '/workbook',
  view: () => import(/* webpackChunkName: "supv/homework/workbook" */ './modules/workbook'),
});

export const listRoute = createRoute({
  path: '/list',
  view: () => import(/* webpackChunkName: "supv/homework/list" */ './modules/list'),
});

export const detailRoute = createRoute({
  path: '/detail',
  view: () => import(/* webpackChunkName: "supv/homework/detail" */ './modules/detail'),
});

export const assignmentRoute = createRoute({
  path: '/assignment',
  view: () => import(/* webpackChunkName: "supv/homework/assignment" */ './modules/assignment'),
});

export const communicationRegionRoute = createRoute({
  path: '/communication-region',
  view: () => import(/* webpackChunkName: "supv/homework/communication-region" */ './modules/communication-region'),
});
export const defaultRoute = createRoute({ path: '*', redirect: '/list' });

export const [AppRouterView, useRouter] = createRouter({
  base: '/wscvis/supv/homework',
  routes: [
    workbookRoute,
    listRoute,
    detailRoute,
    assignmentRoute,
    communicationRegionRoute,
    defaultRoute,
  ],
});
