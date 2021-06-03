import { createRouter } from 'fns/router';
import TeacherListPage from './container/TeacherListPage';
import TeacherDetailPage from './container/TeacherDetailPage';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes: Array<object> = [
  {
    path: 'list',
    component: TeacherListPage,
    breadcrumb: '',
    onEnter() {},
  },
  {
    path: 'detail/*',
    component: TeacherDetailPage,
    breadcrumb: '老师详情',
    onEnter() {},
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
