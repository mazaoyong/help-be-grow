import {
  format,
  endOfWeek,
  startOfWeek,
} from 'date-fns';
import { Toast } from 'vant';
import {
  SET_DAYS_LIST,
  SET_FETCHED,
  SET_CURRENT_YEAR,
  SET_CURRENT_MONTH,
} from '../mutation-types';
import { getDays } from '../../../../apis/schedule-list';

function formatTime(year, month) {
  const firstDayOfMonth = new Date(year, month, 1); // 当前月份的第一天
  const lastDayOfMonth = new Date(year, month + 1, 0); // 获取当前月份的最后一天
  const firstDayOfCalendar = startOfWeek(firstDayOfMonth, { weekStartsOn: 1 }); // 显示在日历中的第一天
  const lastDayOfCalendar = endOfWeek(lastDayOfMonth, { weekStartsOn: 1 }); // 显示在日历中的最后一天

  const startTime = format(firstDayOfCalendar, 'x');
  const endTime = format(lastDayOfCalendar, 'x');
  return {
    startTime,
    endTime,
  };
}

export default {
  state: {
    fetched: false,
    daysList: [], // 日历有课程的列表
    currentYear: new Date().getFullYear(),
    currentMonth: new Date().getMonth() + 1,
  },

  mutations: {
    [SET_DAYS_LIST](state, daysList) {
      state.daysList = daysList;
    },
    [SET_FETCHED](state, fetched) {
      state.fetched = fetched;
    },
    [SET_CURRENT_YEAR](state, currentYear) {
      state.currentYear = currentYear;
    },
    [SET_CURRENT_MONTH](state, currentMonth) {
      state.currentMonth = currentMonth;
    },
  },

  actions: {
    // 获取可选日程的日期列表
    fetchDaysList({ state, rootState, commit }) {
      const { startTime, endTime } = formatTime(state.currentYear, state.currentMonth - 1);
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

      getDays({ query })
        .then(res => {
          if (res) {
            commit(SET_DAYS_LIST, res || []);
            commit(SET_FETCHED, true);
          }
        })
        .catch(errMsg => {
          commit(SET_FETCHED, true);
          Toast(`获取日历数据失败${errMsg ? `：${errMsg}` : ''}`);
        });
    },
  },
};
