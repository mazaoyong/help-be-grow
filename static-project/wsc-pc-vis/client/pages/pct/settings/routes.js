import { createRouter } from 'fns/router';

import Hiding from './containers/hiding';
import Setting from './containers/setting';

const isYZEdu = window._global.isYZEdu;

const routes = [
  {
    path: 'hiding',
    component: Hiding,
    breadcrumb: {
      project: '信息隐藏',
    },
  },
  {
    path: 'setting',
    component: Setting,
    breadcrumb: {
      project: isYZEdu ? '个性化设置' : '设置',
    },
  },
  {
    path: '*',
    redirect: 'setting',
  },
];

export default createRouter(routes);
