import { Mutation } from 'vuex';
import { merge } from 'lodash';

import { IStoreState, initialState } from './state';
import { ICommentStrut } from '../utils/handleDiaryList';

export interface MutationList {
  SET_BOUGHT_STATUS: IStoreState['bought'];
  SET_ALIAS: IStoreState['alias'];
  SET_ALLOW_VIEW: IStoreState['allowStudentView'];
  SET_ALLOW_EDIT: IStoreState['allowStudentEdit'];
  SET_BUTTON_SETTING: IStoreState['buttonSetting'];
  SET_MY_DIARY: IStoreState['myDiary'];
  SET_HAS_DIARY: IStoreState['hasDiary'];
  SET_FETCH_DIARY: IStoreState['fetchDiary'];
  SET_DIARY_LIST: IStoreState['diaryList'];
  UPDATE_DIARY_LIST: IStoreState['diaryList'];
  SET_CALENDAR: IStoreState['calendar'];
  SET_TASK: Partial<IStoreState['task']>;
  RESET_TASK: void;
  SET_TASK_CONTENT: IStoreState['taskContent'];
  SET_USER: IStoreState['user'];
  SET_PAGE_INFO: IStoreState['pageInfo'];
  SET_SPECIFIC_COMMENT_LIST: {
    index: number;
    commentList: ICommentStrut[];
    commentNumber: number;
    isMyDiary?: boolean;
  };
  SET_SPECIFIC_LIKE_LIST: {
    index: number;
    likeList: ICommentStrut[];
    isMyDiary?: boolean;
    hasLike: boolean;
  };
}

export type MutationType = Record<keyof MutationList, Mutation<IStoreState>>;
export type CustomCommit = <K extends keyof MutationList>(
  type: K,
  payload: MutationList[K]
) => void;

const mutations: MutationType = {
  SET_BOUGHT_STATUS(state, payload: MutationList['SET_BOUGHT_STATUS']) {
    state.bought = payload;
  },
  SET_ALIAS(state, payload: MutationList['SET_ALIAS']) {
    state.alias = payload;
  },
  SET_ALLOW_VIEW(state, payload: MutationList['SET_ALLOW_VIEW']) {
    state.allowStudentView = payload;
  },
  SET_ALLOW_EDIT(state, payload: MutationList['SET_ALLOW_EDIT']) {
    state.allowStudentEdit = payload;
  },
  SET_BUTTON_SETTING(state, payload: MutationList['SET_BUTTON_SETTING']) {
    state.buttonSetting = payload;
  },
  SET_HAS_DIARY(state, payload: MutationList['SET_HAS_DIARY']) {
    state.hasDiary = payload;
  },
  SET_MY_DIARY(state, payload: MutationList['SET_MY_DIARY']) {
    state.myDiary = payload;
  },
  SET_DIARY_LIST(state, payload: MutationList['SET_DIARY_LIST']) {
    state.diaryList = payload;
  },
  SET_FETCH_DIARY(state, payload: MutationList['SET_FETCH_DIARY']) {
    state.fetchDiary = payload;
  },
  UPDATE_DIARY_LIST(state, payload: MutationList['UPDATE_DIARY_LIST']) {
    const prevDiaryList = state.diaryList;
    const currentDiaryList = (prevDiaryList || []).concat(payload);
    state.diaryList = currentDiaryList;
  },
  SET_CALENDAR(state, payload: MutationList['SET_CALENDAR']) {
    state.calendar = { ...state.calendar, ...payload };
  },
  SET_TASK_CONTENT(state, payload: MutationList['SET_TASK_CONTENT']) {
    state.taskContent = payload;
  },
  SET_TASK(state, payload: MutationList['SET_TASK']) {
    state.task = { ...state.task, ...payload };
  },
  RESET_TASK(state) {
    state.task = merge(state.task, initialState.task);
  },
  SET_USER(state, payload: MutationList['SET_USER']) {
    state.user = { ...state.user, ...payload };
  },
  SET_PAGE_INFO(state, payload: MutationList['SET_PAGE_INFO']) {
    const prePage = state.pageInfo.page;
    state.pageInfo = { ...state.pageInfo, prePage, ...payload };
  },

  // 单独设置一个数据的comments
  SET_SPECIFIC_COMMENT_LIST(
    state,
    payload: MutationList['SET_SPECIFIC_COMMENT_LIST']
  ) {
    const { index, commentList, commentNumber, isMyDiary = false } = payload;
    if (isMyDiary) {
      state.myDiary.commentData.commentNumber = commentNumber;
      state.myDiary.commentData.commentList = commentList;
    } else {
      const currentDiary = state.diaryList[index];
      if (currentDiary) {
        currentDiary.commentData.commentNumber = commentNumber;
        currentDiary.commentData.commentList = commentList;
        const list = state.diaryList;
        list.splice(index, 1, currentDiary);
        state.diaryList = list;
      }
    }
  },
  // 单独设置一个数据的like list
  SET_SPECIFIC_LIKE_LIST(
    state,
    payload: MutationList['SET_SPECIFIC_LIKE_LIST']
  ) {
    const { index, likeList, isMyDiary = false, hasLike } = payload;
    if (isMyDiary) {
      state.myDiary.commentData.like = likeList;
      state.myDiary.commentData.hasLike = hasLike;
    } else {
      const currentDiary = state.diaryList[index];
      if (currentDiary) {
        currentDiary.commentData.like = likeList;
        currentDiary.commentData.hasLike = hasLike;
        const list = state.diaryList;
        list.splice(index, 1, currentDiary);
        state.diaryList = list;
      }
    }
  },
};

export default mutations;
