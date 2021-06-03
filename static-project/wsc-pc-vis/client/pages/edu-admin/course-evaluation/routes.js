import { createRouter } from 'fns/router';
import ListPage from './ListPage';

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
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
