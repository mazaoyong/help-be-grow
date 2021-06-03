import { createRouter } from 'fns/router';

import List from './containers/list';
import Edit from './containers/edit';

const routes = [
  { path: 'list/:type', component: List, index: 'list/3', breadcrumb: '' },
  { path: 'add', component: Edit, breadcrumb: '新建活动' },
  { path: 'edit/:id', component: Edit, breadcrumb: '编辑活动' },
  { path: 'view/:id', component: Edit, breadcrumb: '查看活动' },
  { path: '*', redirect: 'list/3', breadcrumb: '' },
];

export default createRouter(routes);
