import { createRouter } from 'fns/router';
import ListPage from './list';
import EditPage from './edit';
import Statistics from './stats';
import { editPageTypeMap } from './constants';

const routes = [
  {
    path: 'list',
    component: ListPage,
    breadcrumb: '',
  },
  {
    path: 'edit/:id',
    component: EditPage,
    breadcrumb: `${editPageTypeMap.edit}活动`,
  },
  {
    path: 'add/:id',
    component: EditPage,
    breadcrumb: `${editPageTypeMap.add}活动`,
  },
  {
    path: 'add',
    component: EditPage,
    breadcrumb: `${editPageTypeMap.add}活动`,
  },
  {
    path: 'detail/:id',
    component: EditPage,
    breadcrumb: `${editPageTypeMap.detail}活动`,
  },
  {
    path: 'stats/:id',
    component: Statistics,
    breadcrumb: '效果数据',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
