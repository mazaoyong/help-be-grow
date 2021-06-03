// @ts-check
import { createRouter, visPush } from 'fns/router';

import Order from './order';
import Export from './export';

const isYZEdu = window._global.isYZEdu;

/**
 * @type {import('fns/router').IVisRoutes[]}
 */
const routes = [
  {
    path: 'order',
    component: Order,
    breadcrumb: {
      project: isYZEdu ? '信息采集记录' : '订购记录',
    },
    onEnter() {
      if (!isYZEdu) {
        visPush(`tabs/order`);
      }
    },
  },
  {
    path: 'export/:type',
    component: Export,
    breadcrumb: {
      project: '导出记录',
    },
  },
  {
    path: '*',
    redirect: 'order',
  },
];

export default createRouter(routes);
