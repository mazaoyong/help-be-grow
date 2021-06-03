import { IVisRoutes, createRouter } from 'fns/router';

import { SigninList } from './blocks/list';
import { SigninEdit } from './blocks/edit';

const routes: IVisRoutes[] = [
  {
    path: 'edit',
    component: SigninEdit,
    title: '签到码设置',
    breadcrumb: '签到码设置',
  },
  {
    path: 'list',
    component: SigninList,
    title: '签到记录',
    breadcrumb: '签到记录列表',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
