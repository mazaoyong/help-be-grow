import createModule from '@/common/plugins/module/createModule';
import BlockStartExam from './blocks/StartExam.vue';
import store from './store';
export { default as BlockStartExam } from './blocks/StartExam.vue';

export default createModule({
  name: 'startExam',
  component: BlockStartExam as any,
  store,
  methods: {
    startExam(...args: any[]) {
      this.componentInstance.startExam(...args);
    },
    showCourseList(...args: any[]) {
      this.componentInstance.showCourseList(...args);
    },
    reexam(...args: any[]) {
      this.componentInstance.reexam(...args);
    },
  },
});
