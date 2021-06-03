import { createRouter, IVisRoutes } from 'fns/router';
import StudentProfileList from './pages/list';

const routes: IVisRoutes[] = [
  {
    path: 'list',
    component: StudentProfileList,
    breadcrumb: '',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
