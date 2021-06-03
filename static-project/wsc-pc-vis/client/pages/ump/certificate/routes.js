import createRouteTabs from './components/tab-router';

import Certificates from './containers/certificates';
import Records from './containers/records';
import AdminssionEditor from './containers/editor/admission';
import GraduationEditor from './containers/editor/graduation';
import Continue from './containers/editor/continue';

const routes = [
  {
    path: 'certificates',
    component: Certificates,
    breadcrumb: '',
    meta: {
      title: '学员证书',
    },
  },
  {
    path: 'records',
    component: Records,
    breadcrumb: '',
    meta: {
      title: '证书发放记录',
    },
  },
  {
    path: 'editor/admission/:id',
    component: AdminssionEditor,
    breadcrumb: '编辑入学证书',
    meta: {
      visible: false,
    },
  },
  {
    path: 'editor/admission',
    component: AdminssionEditor,
    breadcrumb: '新建入学证书',
    meta: {
      visible: false,
    },
  },
  {
    path: 'editor/graduation/:id',
    component: GraduationEditor,
    breadcrumb: '编辑毕业证书',
    meta: {
      visible: false,
    },
  },
  {
    path: 'editor/graduation',
    component: GraduationEditor,
    breadcrumb: '新建毕业证书',
    meta: {
      visible: false,
    },
  },
  {
    path: 'editor/continue',
    component: Continue,
    meta: {
      visible: false,
    },
  },
  {
    path: '*',
    redirect: 'certificates',
  },
];

export default createRouteTabs(routes);
