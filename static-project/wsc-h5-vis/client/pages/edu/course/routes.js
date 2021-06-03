import { ExamListRoute } from 'supv/examination/modules/course-exam';

const CourseDetail = r => require.ensure([], () => r(require('./course-detail/index.vue')), 'edu/course-detail');
const CourseList = r => require.ensure([], () => r(require('./course-detail/components/course-list/index.vue')), 'edu/course-detail-list');

const routes = [{
  name: 'CourseDetail',
  path: '/coursedetail',
  component: CourseDetail,
  meta: {
    title: '课程主页',
    hideCopyright: true,
  },
}, {
  name: 'CourseList',
  path: '/courselist/:assetNo',
  component: CourseList,
  meta: {
    title: '待上课',
    hideCopyright: true,
  },
}, ExamListRoute];

export default routes;
