import React from 'react';
import { renderRouter, IVisRoutes } from 'fns/router';
import { browserHistory, Router } from 'react-router';

import Appointment from './containers/appointment';
import Eliminate from './containers/eliminate';
import Holiday from './containers/holiday';

const basePath = '/v4/vis/edu/page/settings';
const routes = [
  {
    path: `${basePath}/eliminate`,
    component: Eliminate,
    breadcrumb: '消课设置',
  },
  {
    path: `${basePath}/holiday`,
    component: Holiday,
    breadcrumb: '节假日设置',
  },
  {
    path: `${basePath}`,
    component: Appointment,
    breadcrumb: '预约设置',
  },
  {
    path: '*',
    redirect: `${basePath}`,
  },
];

function EduAdminRouter(routes: IVisRoutes[]): JSX.Element {
  return <Router history={browserHistory}>{renderRouter('', routes)}</Router>;
}
export default EduAdminRouter(routes);
