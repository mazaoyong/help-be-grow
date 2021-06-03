
import { isEduShop } from '@youzan/utils-shop';
import { createPluginFrameworkRouter } from '@ability-center/clue/plugin-framework';

import ClueList from './containers/list';
import BatchImport from './containers/batch-import';
import { menus } from '../common/clue-plugin-config';
import BootPage from '../clueplugin/App';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'list',
    component: ClueList,
    breadcrumb: '',
  },
  {
    path: 'add',
    component: BatchImport,
    breadcrumb: '批量导入线索',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createPluginFrameworkRouter({ title: '线索管理', BootPage, routes, menus, enabled: !isEduShop });
