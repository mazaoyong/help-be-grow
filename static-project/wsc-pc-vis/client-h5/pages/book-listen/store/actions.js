import { bookListen } from 'pages-api';

export default {
  // 确认预约时获取预约信息
  fetchAppointment({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .GetAppointment(data)
        .then(res => {
          if (res) {
            resolve(res);
            commit('GET_APPOINTMENT_INFO', res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  getStudentLessonForUpdate({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .getStudentLessonForUpdate(data)
        .then(res => {
          if (res) {
            resolve(res);
            commit('GET_APPOINTMENT_EDIT_INFO', res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  updateAppointment({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .updateStudentLesson(data)
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

  pollUpdateResult(_, query) {
    return new Promise((resolve, reject) => {
      let duration = 0;
      const threshold = 15000;
      const defaultInterval = 1000;

      const intervalTask = (interval) => {
        setTimeout(() => {
          duration += interval;
          bookListen.getUpdateAppointmentResult(query)
            .then(res => {
              if (res) {
                resolve();
              } else if (duration >= threshold) {
                reject('获取结果超时');
              } else {
                intervalTask(interval);
              }
            })
            .catch(errMsg => {
              reject(errMsg);
            });
        }, interval);
      };

      intervalTask(defaultInterval);
    });
  },

  // 获取线索列表
  fetchStudents({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .GetStudentList(data)
        .then(res => {
          if (res) {
            resolve(res);
            commit('GET_STUDENTS', res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 获取课程列表
  fetchCourseList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .GetCourceList(data)
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

  // 获取可选日程的日期列表
  fetchDaysList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .GetDaysList(data)
        .then(res => {
          if (res) {
            resolve(res);
            commit('GET_DAYS_LIST', res);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  // 获取日程列表
  fetchLessonList({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .GetLessonsList(data)
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

  // 创建试听
  createAppointment({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .PostCreateAppointment(data)
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

  // 创建自由时间试听
  createClueAppointment({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .PostCreateClueAppointment(data)
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

  // 确认试听
  confirmAppointment({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen
        .PostConfirmAppointment(data)
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

  // 学员时间冲突检测
  detectConflict({ commit }, data = {}) {
    return new Promise((resolve, reject) => {
      bookListen.DetectConflict(data)
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

  // 更新已选择的试听项
  updateBookListenInfo({ commit }, data = {}) {
    commit('UPDATE_BOOK_LISTEN_INFO', data);
  },

  // 更新已选择的学员信息
  updateSelectedStu({ commit }, data = {}) {
    commit('UPDATE_SELECTED_STU', data);
  },

  // 更新已选择的课程信息
  updateSelectedCourse({ commit }, data = {}) {
    commit('UPDATE_SELECTED_COURSE', data);
  },

  // 更新已选择的日程
  updateSelectedSchedule({ commit }, data = {}) {
    commit('UPDATE_SELECTED_SCHEDULE', data);
  },
};
