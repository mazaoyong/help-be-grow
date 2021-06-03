import { createRoute, createRouter } from '@youzan/tany-vue';

export const listRoute = createRoute({
  path: '/list/:workbookId',
  view: () => import(/* webpackChunkName: "supv/homework/list" */ './modules/list'),
});
export const bookListRoute = createRoute({
  path: '/book/list',
  view: () => import(/* webpackChunkName: "supv/homework/book-list" */ './modules/book-list'),
});
export const addBookRoute = createRoute({
  path: '/book/add/:workbookId',
  view: () => import(/* webpackChunkName: "supv/homework/book-edit" */ './modules/book-edit/index'),
});
export const editBookRoute = createRoute({
  path: '/book/edit/:homeworkId',
  view: () => import(/* webpackChunkName: "supv/homework/book-edit" */ './modules/book-edit/index'),
});
export const detailRoute = createRoute({
  path: '/:homeworkId',
  view: () => import(/* webpackChunkName: "supv/homework/detail" */ './modules/detail'),
});
export const reviewRoute = createRoute({
  path: '/review/:assignmentId',
  view: () => import(/* webpackChunkName: "supv/homework/review" */ './modules/review'),
});

export const [AppRouterView, useRouter] = createRouter({
  mode: 'hash',
  base: '/',
  routes: [
    listRoute,
    bookListRoute,
    addBookRoute,
    editBookRoute,
    detailRoute,
    reviewRoute,
    { path: '*', redirect: '/book/list' },
  ],
});
