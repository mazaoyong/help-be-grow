import { createRouter } from 'fns/router';
import ListPage from './ListPage';
import PrintPage from './PrintPage';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'list',
    component: ListPage,
    breadcrumb: '',
  },
  {
    path: 'print/:refundNo',
    component: PrintPage,
    breadcrumb: '退课凭证',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
