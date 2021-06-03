import ExamBlock from './blocks/ExamBlock.vue';
import ExamPopup from './blocks/ExamPopup.vue';
import { withStore } from './utils';

export { hasExam } from './utils';
export { ExamList as ExamListRoute } from './routes';

export const CourseExamBlock = withStore(ExamBlock);
export const CourseExamPopup = withStore(ExamPopup);
