import createModule from '@/common/plugins/module/createModule';

export default createModule({
  name: 'invalid',
  route: {
    name: 'invalid',
    path: '/invalid',
    component: (() => import(/* webpackChunkName: 'supv-examination-invalid' */ './Invalid.vue')) as any,
    meta: {
      title: '考试已失效',
    },
  },
});
