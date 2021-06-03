import { createRouter, IVisRoutes } from 'fns/router';
import { ActivityList } from './pages/activity-list';
import { ActivityEdit } from './pages/activity-edit';
import { OldStudents } from './pages/old-students';
import { NewStudents } from './pages/new-students';

const routes: IVisRoutes[] = [
  {
    path: 'list',
    component: ActivityList,
    breadcrumb: '',
  },
  // 修改ActivityEdit相关路由path时，请确认同步修改该组件getEditType函数
  {
    path: 'edit/:id',
    component: ActivityEdit,
    breadcrumb: '编辑活动',
  },
  {
    path: 'add/:id',
    component: ActivityEdit,
    breadcrumb: '新建活动',
  },
  {
    path: 'add',
    component: ActivityEdit,
    breadcrumb: '新建活动',
  },
  {
    path: 'detail/:id',
    component: ActivityEdit,
    breadcrumb: '查看活动',
  },

  {
    path: 'old-students/:id',
    component: OldStudents,
    breadcrumb: '老学员列表',
  },
  {
    path: 'new-students/:id',
    component: NewStudents,
    breadcrumb: '新学员列表',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
