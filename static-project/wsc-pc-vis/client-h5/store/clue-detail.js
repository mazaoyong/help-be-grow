import { clueDetail, signIn } from 'pages-api';

const clueDetailModule = {
  namespaced: true,
  state: {
    clueDetail: {}, // 线索详情 - 线索学员信息和标签
    recordList: [], // 线索详情 - 已购课程列表
    lessonList: [], // 线索详情 - 体验课列表
    courseList: [], // 线索详情 - 已购课程列表
    signupDetailData: {}, // 报名详情
    dynamicFollowData: {}, // 线索详情 - 动态记录 - 查看更多的跟进记录
    dynamicStudentData: {}, // 线索详情 - 动态记录 - 更新基本资料
    dynamicTagData: {}, // 线索详情 - 动态记录 - 更新标签
  },
  actions: {
    getClueDetailById({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .GetClueDetailById(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_CLUE_DETAIL', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    findStudentLessonsForClue({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .FindStudentLessonsForClue(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_LESSON_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    findStudentLessonsByIdentity({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .FindStudentLessonsByIdentity(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_LESSON_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    findPageByMobileWithCourse({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .FindPageByMobileWithCourse(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_COURSE_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    findPageClueRecords({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .FindPageClueRecords(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('GET_RECORD_LIST', res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getNextDetailById({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .GetNextDetailById(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    findListAllCampus({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .FindListAllCampus(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    cancelAppointment({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .CancelAppointment(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    changeState({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .ChangeState(data)
          .then(res => {
            if (res) {
              resolve(res);
              commit('CHANGE_STATE', data.targetStateCode);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    createPreAppointment({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .CreatePreAppointment(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    getClueSetting(_, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .getClueSetting(data)
          .then(res => {
            res ? resolve(res) : reject();
          })
          .catch(reject);
      });
    },
    queryRelatedOrder(_, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .queryRelatedOrder(data)
          .then(res => {
            res ? resolve(res) : reject();
          })
          .catch(reject);
      });
    },
    createClueRecord({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .CreateClueRecord(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    updateClueRecord({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .UpdateClueRecord(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    signIn({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        signIn
          .SignIn(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    distributeClues({ commit }, data = {}) {
      return new Promise((resolve, reject) => {
        clueDetail
          .DistributeClues(data)
          .then(res => {
            if (res) {
              resolve(res);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    setSignupDetailData({ commit }, data = {}) {
      commit('SET_SIGNUP_DETAIL_DATA', data);
    },
    updateDynamicFollowData({ commit }, data = {}) {
      commit('UPDATE_DYNAMIC_FOLLOW_DATA', data);
    },
    updateDynamicStudentData({ commit }, data = {}) {
      commit('UPDATE_DYNAMIC_STUDENT_DATA', data);
    },
    updateDynamicTagData({ commit }, data = {}) {
      commit('UPDATE_DYNAMIC_TAG_DATA', data);
    },
  },
  mutations: {
    GET_CLUE_DETAIL(state, res) {
      state.clueDetail = res;
    },
    GET_LESSON_LIST(state, res) {
      state.lessonList = res;
    },
    GET_COURSE_LIST(state, res) {
      state.courseList = res;
    },
    GET_RECORD_LIST(state, res) {
      state.recordList = res;
    },
    CHANGE_STATE(state, targetStateCode) {
      state.clueDetail.phase = targetStateCode;
    },
    SET_SIGNUP_DETAIL_DATA(state, data) {
      state.signupDetailData = data;
    },
    UPDATE_DYNAMIC_FOLLOW_DATA(state, data) {
      state.dynamicFollowData = data;
    },
    UPDATE_DYNAMIC_STUDENT_DATA(state, data) {
      state.dynamicStudentData = data;
    },
    UPDATE_DYNAMIC_TAG_DATA(state, data) {
      state.dynamicTagData = data;
    },
  },
  getters: {
    clueDetail(state) {
      return state.clueDetail;
    },
    lessonList(state) {
      return state.lessonList;
    },
    courseList(state) {
      return state.courseList;
    },
    recordList(state) {
      return state.recordList;
    },
    signupDetailData(state) {
      return state.signupDetailData;
    },
    dynamicFollowData(state) {
      return state.dynamicFollowData;
    },
    dynamicStudentData(state) {
      return state.dynamicStudentData;
    },
    dynamicTagData(state) {
      return state.dynamicTagData;
    },
  },
};

export default clueDetailModule;
