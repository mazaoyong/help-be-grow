const ActiveList = r => require.ensure([], () => r(require('./container/ActiveList.vue')), 'edu/reward/list/active');
const ExpireList = r => require.ensure([], () => r(require('./container/ExpireList.vue')), 'edu/reward/list/expire');
const GetAward = r => require.ensure([], () => r(require('./container/GetAward.vue')), 'edu/reward/list/get-award');

const routes = [
  {
    name: 'RewardListActive',
    path: '/active',
    component: ActiveList,
  },
  {
    name: 'RewardListExpire',
    path: '/expire',
    component: ExpireList,
  },
  {
    name: 'RewardListGetAward',
    path: '/get-award',
    component: GetAward,
  },
  {
    name: 'RewardListIndex',
    path: '*',
    component: ActiveList,
    meta: {
      title: '我的奖励',
    },
  },
];

export default routes;
