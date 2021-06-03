// @ts-check
import { hashHistory } from 'react-router';
import { createRouter } from 'fns/router';

import ListPage from './ListPage';
import EditPage from './EditPage';
import Detail from './pages/detail/index';
import Result from './pages/result';
import { ACTIVITY_STATUS } from './constants.js';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'list/:type',
    component: ListPage,
    breadcrumb: '',
  },
  {
    path: 'add',
    component: EditPage,
  },
  {
    path: 'edit',
    component: EditPage,
  },
  {
    path: 'detail/:id',
    component: Detail,
    breadcrumb: '参与列表',
  },
  {
    path: 'sheet/:id',
    component: Result,
    breadcrumb: '查看答卷',
  },
  {
    // 老链接重定向
    path: 'exam*',
    onEnter({ params, location }) {
      const { splat = `list/${ACTIVITY_STATUS.ALL}` } = params;
      hashHistory.replace(splat + location.search);
    },
  },
  {
    path: '*',
    redirect: `list/${ACTIVITY_STATUS.ALL}`,
  },
];

export default createRouter(routes);
