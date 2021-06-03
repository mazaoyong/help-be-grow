import { createRouter, IVisRoutes } from 'fns/router';

import { Tabs } from './pages/tabs';
import { Management } from './pages/management';
import { Settings } from './pages/settings';

const routes: IVisRoutes[] = [
  {
    path: '/',
    component: Tabs,
    index: 'management',
    children: [
      { path: 'management', component: Management },
      { path: 'settings', component: Settings },
    ],
  },
  {
    path: '*',
    redirect: 'management',
  },
];

export default createRouter(routes);
