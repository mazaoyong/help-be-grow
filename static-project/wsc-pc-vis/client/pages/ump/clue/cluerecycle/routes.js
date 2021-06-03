import { createPluginFrameworkRouter } from '@ability-center/clue/plugin-framework';
import { isEduShop } from '@youzan/utils-shop';
// 共用线索池的线索详情，小心
import DetailPage from '../cluepool/containers/detail';
import ListPage from './App';
import { menus } from '../common/clue-plugin-config';
import BootPage from '../clueplugin/App';

/**
 * @type {import('fns/router').IVisRoutes[]}
 *
 */
const routes = [
  {
    path: '/',
    component: ListPage,
    breadcrumb: '',
  },
  {
    path: 'detail/:clueId',
    component: DetailPage,
    breadcrumb: '线索详情',
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default createPluginFrameworkRouter({ title: '线索管理', BootPage, routes, menus, enabled: !isEduShop });
