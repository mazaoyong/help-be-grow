import { createRouter, visPush } from 'fns/router';

import List from './list';
import Edit from './edit';
import Manage from './manage';

const { isYZEdu } = window._global;

const routes = [
  {
    path: 'list',
    component: List,
    breadcrumb: '',
    onEnter() {
      if (!isYZEdu) {
        visPush(`tabs/benefit`);
      }
    },
  },
  {
    path: 'add',
    component: Edit,
    breadcrumb: '创建权益包',
    onEnter() {},
  },
  {
    path: 'edit/:benefitAlias',
    component: Edit,
    breadcrumb: '编辑权益包',
    onEnter() {},
  },
  {
    path: 'manage/:benefitAlias',
    component: Manage,
    breadcrumb: '会员权益内容管理',
    onEnter() {},
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
