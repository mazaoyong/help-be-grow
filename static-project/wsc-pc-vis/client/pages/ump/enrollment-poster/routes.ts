import { createRouter } from 'fns/router';
import ListPage from './container/list-page';
import CreatePage from './container/create-page';

const routes = [
  {
    path: 'list',
    component: ListPage,
    breadcrumb: '',
  },
  {
    path: 'create',
    component: CreatePage,
    breadcrumb: '新建海报',
  },
  {
    path: 'edit/:id',
    component: CreatePage,
    breadcrumb: '编辑海报',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
