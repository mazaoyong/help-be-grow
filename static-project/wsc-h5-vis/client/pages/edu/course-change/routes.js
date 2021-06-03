
const ChangeList = r => require.ensure([], () => r(require('./change-list/index.vue')), 'course-change/change-list');
const ChangeDetail = r => require.ensure([], () => r(require('./change-detail/index.vue')), 'course-change/change-detail');

const routes = [{
  name: 'ChangeList',
  path: '/changelist',
  component: ChangeList,
  meta: {
    title: '变更明细',
    hideCopyright: true,
  },
}, {
  name: 'ChangeDetail',
  path: '/changedetail/:index/:operationType',
  component: ChangeDetail,
  meta: {
    title: '变更详情',
    hideCopyright: true,
  },
}];

export default routes;
