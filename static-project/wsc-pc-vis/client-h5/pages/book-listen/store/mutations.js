import {
  GET_APPOINTMENT_INFO,
  GET_STUDENTS,
  GET_COURSE_LIST,
  GET_DAYS_LIST,
  GET_LESSON_LIST,
  UPDATE_BOOK_LISTEN_INFO,
  UPDATE_SELECTED_STU,
  UPDATE_SELECTED_COURSE,
  UPDATE_SELECTED_SCHEDULE,
  GET_APPOINTMENT_EDIT_INFO,
} from './mutation-types';

export default {
  [GET_APPOINTMENT_INFO](state, res) {
    state.appointmentInfo = res;
  },

  [GET_APPOINTMENT_EDIT_INFO](state, res) {
    state.appointmentEditInfo = res;
  },

  [GET_STUDENTS](state, res) {
    state.students = res;
  },

  [GET_COURSE_LIST](state, res) {
    state.courseList = res;
  },

  [GET_DAYS_LIST](state, res) {
    state.daysList = res;
  },

  [GET_LESSON_LIST](state, data) {
    state.lessonList = data;
  },

  [UPDATE_BOOK_LISTEN_INFO](state, data) {
    state.bookListenInfo = data;
  },

  [UPDATE_SELECTED_STU](state, data) {
    state.selectedStu = data;
  },

  [UPDATE_SELECTED_COURSE](state, data) {
    state.selectedCourse = data;
  },
  [UPDATE_SELECTED_SCHEDULE](state, data) {
    state.selectedSchedule = data;
  },
};
