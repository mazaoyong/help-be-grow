import VueRouter from 'vue-router';

const ClueList = r => require.ensure([], () => r(require('../container/clue-list/index.vue')), 'my-clue/clue-list');
const ClueFilter = r => require.ensure([], () => r(require('../container/clue-filter/index.vue')), 'my-clue/clue-filter');

const routes = [
  { name: 'ClueList',
    path: '/clue-list',
    component: ClueList,
    meta: {
      title: '我的线索',
    } },
  { name: 'ClueFilter',
    path: '/clue-filter',
    component: ClueFilter,
    meta: {
      title: '筛选',
    } },
  { name: 'ClueMulti',
    path: '/clue-multi',
    component: ClueList,
    meta: {
      title: '多选',
    } },
  { name: 'ClueSearch',
    path: '/clue-search',
    component: ClueList,
    meta: {
      title: '搜索',
    } },
  { name: 'ClueList',
    path: '*',
    component: ClueList,
    meta: {
      title: '我的线索',
    } },
];

const router = new VueRouter({ routes });
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
