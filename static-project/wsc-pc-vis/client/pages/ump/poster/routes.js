// @ts-check
import { createRouter } from 'fns/router';

import Tabs from './components/Tabs';
import ListPage from './ListPage';
import EditPage from './EditPage';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: '/',
    component: Tabs,
    index: 'list/3',
    breadcrumb: {
      project: '公众号海报',
    },
    children: [
      { path: 'list/:type', component: ListPage, breadcrumb: '' },
      { path: 'add', component: EditPage, breadcrumb: '新建公众号海报' },
      { path: 'edit/:id', component: EditPage, breadcrumb: '编辑公众号海报' },
      { path: '*', redirect: 'list/3' },
    ],
  },
];

// export default Routes;

export default createRouter(routes);
