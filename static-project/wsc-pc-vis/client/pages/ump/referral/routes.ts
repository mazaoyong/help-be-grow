import { hashHistory } from 'react-router';
import { createRouter, IVisRoutes } from 'fns/router';

import Tabs from './components/tabs/Tabs';
import ListPage from './list';
import EditPage from './edit';
import Statistics from './stats';
import { editPageTypeMap } from './constants';

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes: IVisRoutes[] = [
  {
    path: '/',
    component: Tabs,
    index: 'list/0',
    children: [
      { path: 'list/:type', component: ListPage, breadcrumb: '' },
      { path: 'add', component: EditPage, breadcrumb: `${editPageTypeMap.add}活动` },
      { path: 'edit/:id/:status', component: EditPage, breadcrumb: `${editPageTypeMap.edit}活动` },
      { path: 'copy/:id/:status', component: EditPage, breadcrumb: `${editPageTypeMap.copy}活动` },
      {
        path: 'detail/:id/:status',
        component: EditPage,
        breadcrumb: `${editPageTypeMap.detail}活动`,
      },
      { path: 'stats/:id', component: Statistics, breadcrumb: '效果数据' },
      {
        // 老链接重定向
        path: 'referral/*',
        onEnter({ params }) {
          const { splat = 'list/0' } = params;
          hashHistory.replace(splat);
        },
      },
      { path: '*', redirect: 'list/0' },
    ],
  },
];

export default createRouter(routes);
