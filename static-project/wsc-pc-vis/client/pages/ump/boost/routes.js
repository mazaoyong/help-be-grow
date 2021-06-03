import { createRouter } from 'fns/router';

import App from './app';
import List from './pages/list';
import EditBlock from './pages/edit';
import HistoryPage from './pages/history';

const routes = [
  {
    path: '/',
    component: App,
    index: 'list/3',
    breadcrumb: {
      project: '好友助力',
    },
    children: [
      { path: '/list/:type', component: List, breadcrumb: '' },
      { path: '/add', component: EditBlock, breadcrumb: '新建好友助力' },
      { path: '/edit/:id', component: EditBlock, breadcrumb: '编辑好友助力' },
      { path: '/view/:id', component: EditBlock, breadcrumb: '查看好友助力' },
      { path: '/history', component: HistoryPage, breadcrumb: '' },
      { path: '*', redirect: 'list/3' },
    ],
  },
];

export default createRouter(routes);
