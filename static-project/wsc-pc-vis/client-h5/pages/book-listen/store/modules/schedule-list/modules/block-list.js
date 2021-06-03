import {
  format,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Toast } from 'vant';
import {
  SET_SCHEDULE_LIST,
  SET_LIST_FINISHED,
  SET_LIST_LOADING,
  SET_HAS_ERROR,
  SET_QUERY_DATE,
  SET_LIST_PAGE_NUMBER,
} from '../mutation-types';
import {
  getScheduleList,
} from '../../../../apis/schedule-list';

export default {
  state: {
    lessonList: [],
    pageNumber: 1,
    queryDate: '', // 当前选中的需要查询课程的日期
    listFinished: true, // 滚动加载是否已经无数据
    hasError: false,
    listLoading: false,
  },

  mutations: {
    [SET_SCHEDULE_LIST](state, data) {
      state.lessonList = data;
    },

    [SET_LIST_FINISHED](state, listFinished) {
      state.listFinished = listFinished;
    },

    [SET_LIST_LOADING](state, listLoading) {
      state.listLoading = listLoading;
    },

    [SET_HAS_ERROR](state, hasError) {
      state.hasError = hasError;
    },

    [SET_QUERY_DATE](state, queryDate) {
      state.queryDate = queryDate;
    },

    [SET_LIST_PAGE_NUMBER](state, pageNumber) {
      state.pageNumber = pageNumber;
    },
  },

  actions: {
    fetchScheduleList({ state, rootState, commit }) {
      const startTime = new Date(format(startOfDay(state.queryDate), 'YYYY/MM/DD HH:mm:ss')).getTime();
      const endTime = new Date(format(endOfDay(state.queryDate), 'YYYY/MM/DD HH:mm:ss')).getTime();
      const query = {
        courseType: 0,
        studentAsset: {
          studentId: rootState.scheduleList.studentId,
        },
        startTime,
        endTime,
      };
      if (rootState.scheduleList.eduCourseId) {
        query.eduCourseId = rootState.scheduleList.eduCourseId;
      }
      if (rootState.scheduleList.lessonName) {
        query.lessonName = rootState.scheduleList.lessonName;
      }

      getScheduleList({ query })
        .then(res => {
          if (res) {
            commit(SET_SCHEDULE_LIST, res || []);
          }
        })
        .catch(errMsg => {
          commit(SET_HAS_ERROR, true);
          Toast(`获取日程列表失败${errMsg ? `：${errMsg}` : ''}`);
        })
        .finally(() => {
          commit(SET_LIST_LOADING, false);
        });
    },
  },
};
