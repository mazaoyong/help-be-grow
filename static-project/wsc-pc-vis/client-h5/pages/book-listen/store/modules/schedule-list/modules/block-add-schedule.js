import { Toast } from 'vant';
import { isEduSingleStore, isEduHqStore } from '@youzan/utils-shop';
import {
  SET_SEARCH_LIST,
  SET_ADD_PAGE_NUMBER,
  SET_SEARCH_LIST_FINISHED,
  SET_CUR_SELECTED_ITEM,
  SET_FIELD_VALUE,
  SET_SEARCHING,
  SET_SHOW_ADD,
} from '../mutation-types';
import {
  getClassStore,
  findPageAllCampus,
  getTeacherList,
  getClassroom,
  validateBeforeModify,
  create,
  getActionResult,
} from '../../../../apis/schedule-list';
import TimingTask from '../../../../../../utils/timing-task';

export const DEFAULT_SCHEDULE_FORM = {
  name: '',
  date: '',
  kdtId: '',
  timerange: [],
  teacherNo: '',
  classroomNo: '',
  assistantNos: [],
  addressId: '',
  maxAppointNum: '',
};

const DEFAULT_PAGE_SIZE = 20;

export default {
  state: {
    showAddPopup: false,
    scheduleForm: {
      ...DEFAULT_SCHEDULE_FORM,
      assistantNos: [],
    },
    searching: false,
    searchList: [],
    searchListFinished: false,
    searchListPageNumber: 0,
    curSelectedItem: null,
  },

  mutations: {
    [SET_SHOW_ADD](state, show) {
      state.showAddPopup = show;
    },

    [SET_SEARCH_LIST](state, searchList) {
      state.searchList = searchList;
    },

    [SET_ADD_PAGE_NUMBER](state, pageNumber) {
      state.searchListPageNumber = pageNumber;
    },

    [SET_SEARCH_LIST_FINISHED](state, searchListFinished) {
      state.searchListFinished = searchListFinished;
    },

    [SET_CUR_SELECTED_ITEM](state, curSelectedItem) {
      state.curSelectedItem = curSelectedItem;
    },

    [SET_FIELD_VALUE](state, { name, value }) {
      if (name === 'timerange') {
        value = value.map(time => {
          if (time) {
            time += ':00';
          }
          return time;
        });
      }
      state.scheduleForm[name] = value;
    },

    [SET_SEARCHING](state, searching) {
      state.searching = searching;
    },
  },

  actions: {
    resetForm({ state }) {
      state.scheduleForm = {
        ...DEFAULT_SCHEDULE_FORM,
        assistantNos: [],
      };
    },

    // 获取新增试听日程表单，点击 field 后弹出的选择列表数据
    async fetchSearchList(
      { state, commit, dispatch },
      { type, searchContent, refresh = false }
    ) {
      if ((!type || state.searching) && !refresh) return;
      commit(SET_SEARCHING, true);

      const typeFnMap = {
        addressId: 'fetchStoreList',
        teacherNo: 'fetchTeacherList',
        assistantNos: 'fetchTeacherList',
        classroomNo: 'fetchClassroomList',
        kdtId: 'fetchCampusList',
      };

      if (refresh) {
        commit(SET_SEARCH_LIST, []);
        commit(SET_ADD_PAGE_NUMBER, 1);
        commit(SET_SEARCH_LIST_FINISHED, false);
      }

      // 请求前拼参数
      const nextPageNumber = state.searchListPageNumber;
      let query = {
        keyword: searchContent || '',
        pageNumber: nextPageNumber,
        pageSize: DEFAULT_PAGE_SIZE,
      };
      // 如果已经选择了上课时间，搜索时需要+参数
      if (state.scheduleForm.date || state.scheduleForm.timerange) {
        query.repeatConfig = {
          type: 1,
          noRepeatConfig: {
            date: state.scheduleForm.date || '',
            startTime: state.scheduleForm.timerange[0] || '',
            endTime: state.scheduleForm.timerange[1] || '',
          },
        };
      }
      if (isEduHqStore && type !== 'kdtId' && state.scheduleForm.kdtId) {
        query.kdtId = state.scheduleForm.kdtId.value;
      }
      const [searchList, total] = await dispatch(
        typeFnMap[type],
        query,
      );

      // 获取到数据后
      if (searchList && searchList.length) {
        const newList = [
          ...state.searchList,
          ...searchList,
        ];
        commit(SET_SEARCH_LIST, newList);
        commit(SET_ADD_PAGE_NUMBER, nextPageNumber + 1);
        if (newList.length >= total) {
          commit(SET_SEARCH_LIST_FINISHED, true);
        }
      } else {
        commit(SET_SEARCH_LIST_FINISHED, true);
      }

      commit(SET_SEARCHING, false);
    },

    async fetchStoreList(_, { keyword }) {
      return getClassStore({
        keyword,
      })
        .then((res) => {
          if (res) {
            return [
              res.map(store => ({
                id: store.id,
                label: store.name,
                value: store.id,
              })),
              res.length,
            ];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    async fetchCampusList(_, { keyword, pageSize, pageNumber }) {
      return findPageAllCampus({
        shopCampusQuery: {
          name: keyword,
        },
        pageRequest: {
          pageSize,
          pageNumber,
          sort: {
            orders: [{
              direction: 'DESC',
              property: 'created_at',
            }],
          },
        },
      })
        .then((res) => {
          if (res && res.content) {
            return [
              res.content.map(campus => ({
                id: campus.kdtId,
                value: campus.kdtId,
                label: campus.shopName,
                isConflict: campus.hasConflict,
              })),
              res.total,
            ];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    async fetchTeacherList(_, {
      keyword,
      kdtId,
      pageSize,
      pageNumber,
      repeatConfig = {},
    }) {
      return getTeacherList({
        query: {
          operateType: 1,
          keyword,
          repeatConfig,
          kdtId: kdtId || _global.kdtId,
          type: 1, // 老师和助教都传 1
        },
        pageRequest: {
          pageSize,
          pageNumber,
          sort: {
            orders: [{
              direction: 'DESC',
              property: 'created_at',
            }],
          },
        },
      })
        .then((res) => {
          if (res && res.content) {
            return [
              res.content.map(teacher => ({
                id: teacher.teacherId,
                value: teacher.teacherNo,
                label: teacher.teacherName || teacher.staffName,
                staffName: teacher.staffName,
                isConflict: teacher.hasConflict,
              })),
              res.total,
            ];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    async fetchClassroomList({ state }, {
      keyword,
      kdtId,
      pageSize,
      pageNumber,
      repeatConfig,
    }) {
      const query = {
        operateType: 1,
        keyword,
        repeatConfig,
        kdtId: kdtId || _global.kdtId,
      };
      if (isEduSingleStore && state.scheduleForm.addressId) {
        query.addressId = state.scheduleForm.addressId.value;
      }

      return getClassroom({
        query,
        pageRequest: {
          pageSize,
          pageNumber,
          sort: {
            orders: [{
              direction: 'DESC',
              property: 'created_at',
            }],
          },
        },
      })
        .then((res) => {
          if (res && res.content) {
            return [
              res.content.map(classroom => ({
                id: classroom.classroomId,
                value: classroom.classroomNo,
                label: classroom.classroomName,
                maxStuNum: classroom.maxStuNum,
                isConflict: classroom.hasConflict,
              })),
              res.total,
            ];
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    async checkScheduleConflict({ state, dispatch }) {
      const {
        name,
        addressId,
        date,
        timerange,
        kdtId,
        teacherNo,
        classroomNo,
        assistantNos,
        maxAppointNum,
      } = state.scheduleForm;
      return dispatch('postBeforeCreate', {
        name,
        addressId: addressId.value,
        date,
        kdtId: (kdtId && kdtId.value) || _global.kdtId,
        startTime: timerange[0],
        endTime: timerange[1],
        teacherNo: teacherNo.value,
        classroomNo: classroomNo.value,
        assistantNos: assistantNos.map(assistant => assistant.value),
        maxAppointNum,
      });
    },

    async postBeforeCreate(_, {
      name,
      addressId,
      date,
      kdtId,
      startTime,
      endTime,
      teacherNo,
      classroomNo,
      assistantNos,
      maxAppointNum,
    }) {
      return new Promise((resolve, reject) => {
        const query = {
          name,
          addressId,
          teacherNo,
          classroomNo,
          assistantNos,
          operateType: 1,
          maxAppointNum,
          isTrial: 1,
          consumeNum: 0,
          repeatConfig: {
            type: 1,
            noRepeatConfig: {
              date,
              endTime,
              startTime,
            },
          },
          kdtId: kdtId || _global.kdtId,
        };
        validateBeforeModify(query)
          .then((res) => {
            if (res === '0') {
              resolve(query);
            }
            // 后端传来的数据格式是"0,1,2,3"这样的数据，0表示没有冲突
            const conflictCodes = res.split(',').map(c => Number(c));
            // 如果没有日程冲突并且设置了重复规则
            if (conflictCodes[0] !== 0) {
              reject({ conflictCodes, query });
            }
          })
          .catch(err => {
            console.error(err);
          });
      });
    },

    async postCreateSchedule({ commit, dispatch }, query) {
      return create(query)
        .then((res) => {
          if (res) {
            let lock = false;
            const handlePolling = (timingTask, data) => {
              const kdtId = query.kdtId || _global.kdtId;
              getActionResult({ taskNo: data, kdtId })
                .then(res => {
                  if (res.actionStatus === 1) {
                    Toast('新建成功');
                    timingTask.stop();
                    commit(SET_SHOW_ADD, false);
                    dispatch('resetForm');
                    dispatch('fetchScheduleList');
                  }
                  lock = false;
                })
                .catch(errMsg => {
                  Toast(`${errMsg ? `新建日程失败：${errMsg}` : '新建日程失败'}`);
                  timingTask.stop();
                  lock = false;
                });
            };

            const timingTask = new TimingTask(15000);
            timingTask
              .start(() => {
                if (!lock) {
                  lock = true;
                  handlePolling(timingTask, res);
                }
              })
              .catch(() => {
                Toast('新建失败');
                timingTask.stop();
              });
          }
        })
        .catch(err => {
          Toast('新建失败');
          console.error(err);
        });
    },
  },
};
