import { isEduShop } from '@youzan/utils-shop';
import { createPluginFrameworkRouter } from '@ability-center/clue/plugin-framework';
import DetailPage from './containers/detail';
import ListPage from './list';
import { menus } from '../common/clue-plugin-config';
import BootPage from '../clueplugin/App';

/**
 * @type {import('fns/router').IVisRoutes[]}
 *
 */
const routes = [
  {
    path: 'list',
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
    redirect: 'list',
  },
];

export default createPluginFrameworkRouter({ title: '线索管理', BootPage, routes, menus, enabled: !isEduShop });
