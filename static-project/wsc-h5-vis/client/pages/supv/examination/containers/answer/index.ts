import createModule from '@/common/plugins/module/createModule';
import store from './store';

export default createModule({
  name: 'answer',
  store,
  route: {
    name: 'answer',
    path: '/answer/:mode',
    component: (() => import(/* webpackChunkName: 'supv-examination-answer' */ './App.vue')) as any,
    meta: {
      hideCopyright: true,
    },
  },
});
