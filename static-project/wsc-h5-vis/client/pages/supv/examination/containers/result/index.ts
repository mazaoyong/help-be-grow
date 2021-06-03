import createModule from '@/common/plugins/module/createModule';
import store from './store';

export default createModule({
  name: 'result',
  store,
  route: {
    name: 'result',
    path: '/result',
    component: (() => import(/* webpackChunkName: 'supv-examination-result' */ './App.vue')) as any,
    meta: {
      title: '考试结果',
    },
  },
});
