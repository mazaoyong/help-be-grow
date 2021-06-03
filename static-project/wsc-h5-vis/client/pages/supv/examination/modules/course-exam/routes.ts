export const ExamList = {
  name: 'ExamList',
  path: '/exam-list',
  component: () => import(/* webpackChunkName: 'supv/examination/exam-list' */ './blocks/ExamList.vue'),
  meta: {
    title: '可参加考试列表',
    hideCopyright: true,
  },
};
