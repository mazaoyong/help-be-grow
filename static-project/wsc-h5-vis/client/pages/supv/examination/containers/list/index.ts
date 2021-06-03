import createModule from '@/common/plugins/module/createModule';

export default createModule({
  name: 'list',
  route: {
    name: 'list',
    path: '/list',
    component: (() => import(/* webpackChunkName: 'supv-examination-list' */ './App.vue')) as any,
    meta: {
      title: '我的考试',
    },
  },
});
