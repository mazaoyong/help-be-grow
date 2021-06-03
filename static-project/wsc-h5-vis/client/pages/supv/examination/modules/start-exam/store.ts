import { Module } from 'vuex';
import { Toast } from 'vant';
import {
  getStudentList,
  startExam,
} from './apis';
import { ICourse } from 'supv/examination/types';

export interface StartExamState {
  hasLimit: boolean;
  courseList: ICourse[];
  studentList: any[];
}

const module: Module<StartExamState, any> = {
  state: {
    hasLimit: false,
    courseList: [],
    studentList: [],
  },
  mutations: {
    updateHasLimit(state, payload) {
      state.hasLimit = payload;
    },
    updateCourseList(state, courseList) {
      state.courseList = courseList;
    },
    updateStudentList(state, payload) {
      state.studentList = payload;
    },
  },
  actions: {
    fetchStartExam(_, data: {
      examId: number;
      joinStudentId: number;
      attrItem: any[];
      userRole: number;
    }) {
      return startExam(data)
        .then(res => {
          if (res) {
            return Promise.resolve();
          } else {
            return Promise.reject('参加考试失败，请稍后重试');
          }
        })
        .catch(errMsg => {
          return Promise.reject(errMsg);
        });
    },

    fetchStudentList({ commit }, examId: number) {
      return getStudentList({
        examId,
      })
        .then(res => {
          if (res) {
            commit('updateStudentList', res);
          } else {
            Toast('获取学员列表失败，请稍后重试');
          }
        })
        .catch(errMsg => {
          Toast(errMsg);
        });
    },
  },
};

export default module;
