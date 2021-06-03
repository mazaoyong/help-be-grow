import { get } from 'lodash';
import ListPage from './pages/list';
import CreatePage from './pages/create';
import ReviewPage from './pages/review-list';
import ReviewDetailPage from './pages/review-detail';
import StatsPage from './pages/stats';
import { createPluginFrameworkRouter } from '@ability-center/clue/plugin-framework';
import BootPage from './pages/plugin';

const routes = [
  {
    path: 'list',
    component: ListPage,
    breadcrumb: '',
  },
  {
    path: 'create',
    component: CreatePage,
    breadcrumb: '新建考试',
  },
  {
    path: 'edit/:id',
    component: CreatePage,
    breadcrumb: '编辑考试',
  },
  {
    path: 'review/:examTemplateId',
    component: ReviewPage,
    breadcrumb: '批阅',
  },
  {
    path: 'review/:examTemplateId/detail/:answerPaperId',
    component: ReviewDetailPage,
    breadcrumb: '批阅详情',
  },
  {
    path: 'stats/:examTemplateId',
    component: StatsPage,
    breadcrumb: '统计分析',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createPluginFrameworkRouter({ title: '考试', BootPage, menus: [], routes, enabled: get(_global, 'pluginInfo.isFirstUsed', true) });
