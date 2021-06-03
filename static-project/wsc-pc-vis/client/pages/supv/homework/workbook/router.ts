import { createRoute } from '@youzan/tany-react';
import List from './modules/list';
import Edit from './modules/edit';
import Manage from './modules/manage';
import { createRouterWithBreadcrumb } from '../utils';

export const workbookListRoute = createRoute({
  path: '/list',
  view: List,
  meta: {
    breadcrumb: '',
  },
});

export const workbookCreateRoute = createRoute({
  path: '/add',
  view: Edit,
  query: {
    eduClassId: '0',
  },
  meta: {
    breadcrumb: '新建作业本',
  },
});

export const workbookEditRoute = createRoute({
  path: '/edit/:id',
  view: Edit,
  meta: {
    breadcrumb: '编辑作业本',
  },
});

export const workbookManageRoute = createRoute({
  path: '/:id/manage/:viewType',
  view: Manage,
  meta: {
    breadcrumb: '作业本管理',
  },
});

export const [RouterView, useWorkbookRouterModel] = createRouterWithBreadcrumb({
  base: '/v4/vis/supv/homework/workbook',
  routes: [
    workbookListRoute,
    workbookCreateRoute,
    workbookEditRoute,
    workbookManageRoute,
    { path: '/:id/manage/*', redirect: '/:id/manage/homeworks' },
    { path: '*', redirect: '/list' },
  ],
});
