import { createRouter } from 'fns/router';

import Panel from './containers/panel';
import Schedule from './containers/panel/components/schedule';
import Table from './containers/panel/components/table';
import Detail from './containers/detail';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'panel',
    component: Panel,
    index: 'view',
    breadcrumb: '',
    children: [
      {
        path: 'view',
        component: Schedule,
      },
      {
        path: 'list',
        component: Table,
      },
    ],
  },
  {
    path: 'detail',
    component: Detail,
    breadcrumb: '日程详情',
  },
  {
    path: '*',
    redirect: 'panel',
  },
];

export default createRouter(routes);
