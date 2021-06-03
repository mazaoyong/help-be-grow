import Router from 'vue-router';

const BookDetail = r =>
  require.ensure(
    [],
    () => r(require('./containers/book-detail/index.vue')),
    'book-listen/book-detail',
  );

// 自由安排试听时间时使用的页面
const FreeBookDetail = r =>
  require.ensure(
    [],
    () => r(require('./containers/free-book-detail/index.vue')),
    'book-listen/free-book-listen',
  );
const StudentList = r =>
  require.ensure(
    [],
    () => r(require('./containers/student-list/index.vue')),
    'book-listen/student-list',
  );
const ScheduleList = r =>
  require.ensure(
    [],
    () => r(require('./containers/schedule-list/index.vue')),
    'book-listen/schedule-list',
  );

const routes = [
  {
    name: 'BookDetail',
    path: '/book-detail',
    component: BookDetail,
    meta: {
      title: '办理试听',
    },
  },
  {
    name: 'FreeBookDetail',
    path: '/free',
    component: FreeBookDetail,
    meta: {
      title: '办理试听',
    },
  },
  {
    name: 'StudentList',
    path: '/student-list',
    component: StudentList,
    meta: {
      title: '选择学员',
    },
  },
  {
    name: 'ScheduleList',
    path: '/schedule-list',
    component: ScheduleList,
    meta: {
      title: '上课日程',
    },
  },
  {
    name: 'BookDetail',
    path: '*',
    component: BookDetail,
    meta: {
      title: '办理试听',
    },
  },
];

const router = new Router({ routes });

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
