import { Toast } from 'vant';

import apis from 'supv/punch/apis';
import {
  UPDATE_TASK_COUNT,
  UPDATE_START_AT,
  UPDATE_END_AT,
  UPDATE_TASK_DATE,
  UPDATE_DATE_STATUS_LIST,
  UPDATE_TASK_NAME,
  UPDATE_TASK_CONTENT,
  UPDATE_LIST_DATE,
} from './mutation-types';

const {
  getCalenderDetail,
  getTaskContentByDate,
} = apis;

export default {
  fetchDetail({ state, commit }) {
    const {
      alias,
      taskDate,
    } = state;

    return getCalenderDetail({
      alias,
    })
      .then(res => {
        if (res && res.bought) {
          commit(UPDATE_TASK_COUNT, res.taskCount);
          commit(UPDATE_START_AT, res.startAt || '');
          commit(UPDATE_END_AT, res.endAt || '');
          commit(UPDATE_DATE_STATUS_LIST, res.taskCalenders || []);
          commit(UPDATE_TASK_NAME, res.taskName || '');
          commit(UPDATE_LIST_DATE, res.listDate);
          try {
            commit(UPDATE_TASK_CONTENT, res.taskContent ? JSON.parse(res.taskContent) : []);
          } catch (err) {
            console.error(err);
          }

          // 如果打卡已结束
          let listDate = res.listDate.replace(/-/g, '/');
          if (new Date(taskDate) > new Date(listDate) || new Date(taskDate) < new Date(listDate)) {
            commit(UPDATE_TASK_DATE, res.listDate);
          }
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '获取详情失败');
      });
  },

  fetchTaskContent({ state, commit }) {
    getTaskContentByDate({
      alias: state.alias || '',
      taskDate: state.taskDate.replace(/\//g, '-'),
    })
      .then((res) => {
        if (res) {
          commit(UPDATE_TASK_NAME, res.name || '');
          try {
            commit(UPDATE_TASK_CONTENT, res.taskContent ? JSON.parse(res.taskContent) : []);
          } catch (err) {
            console.error(err);
          }

          if (!res.name) {
            Toast('此日期无任务内容');
          }
        }
      })
      .catch(() => {
        Toast('此日期无任务内容');
      });
  },
};
