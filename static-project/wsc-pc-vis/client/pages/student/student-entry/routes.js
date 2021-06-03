import { createRouter } from 'fns/router';

// import DetailPage from './detail';
import ListPage from '../student-list';
import StudentDetail from '../student-detail/index';
import AssetsDetail from '../student-course-assets-change/index';
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
    path: 'detail/:studentId',
    component: StudentDetail,
    breadcrumb: '学员详情',
  },
  {
    path: 'assets/:studentId',
    component: AssetsDetail,
    breadcrumb: '变更明细',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
