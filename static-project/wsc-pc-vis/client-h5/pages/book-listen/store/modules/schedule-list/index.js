import Filter from './modules/block-filter';
import Calendar from './modules/block-calendar';
import AddSchedule from './modules/block-add-schedule';
import List from './modules/block-list';
import args from 'zan-utils/url/args';
import {
  SET_COURSE_ID,
  SET_LESSON_NAME,
  SET_STUDENT_ID,
} from './mutation-types';

export default {
  namespaced: true,

  modules: {
    filter: Filter,
    calendar: Calendar,
    add: AddSchedule,
    list: List,
  },

  state: {
    eduCourseId: 0,
    lessonName: '',
    studentId: args.get('studentId', window.location.hash.slice(1)) || 0,
  },

  mutations: {
    [SET_COURSE_ID](state, eduCourseId) {
      state.eduCourseId = eduCourseId;
    },

    [SET_LESSON_NAME](state, lessonName) {
      state.lessonName = lessonName;
    },

    [SET_STUDENT_ID](state, studentId) {
      state.studentId = studentId;
    },
  },
};
