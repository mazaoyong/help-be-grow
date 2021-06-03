import { createRouter } from 'fns/router';
import { hashHistory } from 'react-router';

import RecordList from './pages/list';
import BatchImport from './pages/batch-import';
import ImportRecord from './pages/import-record';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'list',
    component: RecordList,
    breadcrumb: '',
  },
  {
    path: 'add/(:id/)step=:s',
    component: BatchImport,
    breadcrumb: '批量导入学员',
    onEnter({ params }) {
      const { s = '1', id } = params;
      if (Number(s) < 1 || Number(s) > 3) {
        hashHistory.replace(`add${id ? `/${id}` : ''}/step=1`);
      }
    },
  },
  {
    path: 'record/(:id)',
    component: ImportRecord,
    breadcrumb: '查看导入记录',
  },
  {
    path: '*',
    redirect: 'list',
  },
];

export default createRouter(routes);
