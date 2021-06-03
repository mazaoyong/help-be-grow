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

export default {
  [UPDATE_TASK_COUNT](state, taskCount) {
    state.taskCount = taskCount;
  },
  [UPDATE_START_AT](state, startAt) {
    state.startAt = startAt;
  },
  [UPDATE_END_AT](state, endAt) {
    state.endAt = endAt;
  },
  [UPDATE_TASK_DATE](state, taskDate) {
    state.taskDate = taskDate;
  },
  [UPDATE_DATE_STATUS_LIST](state, dateStatusList) {
    state.dateStatusList = dateStatusList;
  },
  [UPDATE_TASK_NAME](state, taskName) {
    state.taskName = taskName;
  },
  [UPDATE_TASK_CONTENT](state, taskContent) {
    state.taskContent = taskContent;
  },
  [UPDATE_LIST_DATE](state, listDate) {
    state.listDate = listDate;
  },
};
