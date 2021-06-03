const Detail = r => require.ensure([], () => r(require('./containers/exam-detail/index.vue')), 'supv/exam/detail');
const Question = r => require.ensure([], () => r(require('./containers/exam-question/index.vue')), 'supv/exam/question');
const Result = r => require.ensure([], () => r(require('./containers/exam-result/index.vue')), 'supv/exam/result');

// const baseUrl = 'h5.youzan.com/v2/paidcontent/index';

const routes = [{
  name: 'Detail',
  path: '/detail',
  component: Detail,
  meta: {
    title: '趣味测试',
    hideCopyright: true,
  },
}, {
  name: 'Question',
  path: '/question/:id',
  component: Question,
  meta: {
    title: '',
    hideCopyright: true,
  },
}, {
  name: 'Result',
  path: '/result',
  component: Result,
  meta: {
    title: '',
    hideCopyright: false,
  },
}, {
  name: 'Detail1',
  path: '*',
  component: Detail,
  meta: {
    title: '趣味测试',
    hideCopyright: true,
  },
}];

export default routes;
