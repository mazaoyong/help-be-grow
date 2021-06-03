import createModule from '@/common/plugins/module/createModule';
import store from './store';

export default createModule({
  name: 'detail',
  store,
  route: {
    name: 'detail',
    path: '/detail',
    component: (() => import(/* webpackChunkName: 'supv-examination-detail' */ './App.vue')) as any,
    meta: {
      title: '考试介绍',
    },
  },
});
