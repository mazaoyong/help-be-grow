import Student from './student';
import Panel from './panel';
import Schedule from '../../../schedule/containers/panel/components/schedule';
import List from '../../../schedule/containers/panel/components/table';
import Record from './record';
import Homework from './homework';
import navWrapper from './NavWrapper';
import { DETAIL_TAB } from '../../constants';

const routes = [
  {
    path: 'student',
    component: navWrapper(Student, DETAIL_TAB.STUDENT),
    breadcrumb: '班级详情',
    onEnter() {},
  },
  {
    path: 'panel',
    index: 'view',
    component: navWrapper(Panel, DETAIL_TAB.PANEL),
    breadcrumb: '班级详情',
    onEnter() {},
    children: [
      {
        path: 'view',
        component: Schedule,
      },
      {
        path: 'list',
        component: List,
      },
    ],
  },
  {
    path: 'record',
    component: navWrapper(Record, DETAIL_TAB.RECORD),
    breadcrumb: '班级详情',
  },
  {
    path: 'homework',
    component: navWrapper(Homework, DETAIL_TAB.HOMEWORK),
    breadcrumb: '作业',
  },
  {
    path: '*',
    redirect: 'student',
  },
];

export default routes;
