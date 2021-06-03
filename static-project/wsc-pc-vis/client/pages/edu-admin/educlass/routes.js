import { createRouter } from 'fns/router';

import List from './containers/list';
import Detail from './containers/detail';
import detailRoute from './containers/detail/route';

const routes = [
  {
    path: 'list',
    component: List,
    breadcrumb: '',
    onEnter() {},
  },
  {
    path: 'detail/:eduClassId/:eduCourseId/:kdtId',
    index: 'student',
    component: Detail,
    children: detailRoute,
  },
  {
    path: '*',
    redirect: '/list',
  },
];

export default createRouter(routes);
