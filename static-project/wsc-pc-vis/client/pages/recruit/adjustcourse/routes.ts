import { createRouter } from 'fns/router';
import Index from './pages/adjust';
import Certificate from './pages/certificate';
import AdjustSuccess from './pages/success';

const routes = [
  {
    path: '/',
    component: Index,
    breadcrumb: '',
  },
  {
    path: '/certificate/:orderNo/:targetKdtId',
    component: Certificate,
    breadcrumb: ''
  },
  {
    path: '/success/:eduClassId/:eduCourseId/:kdtId',
    component: AdjustSuccess,
    breadcrumb: ''
  },
  {
    path: '*',
    redirect: '/',
  },
];

export default createRouter(routes);
