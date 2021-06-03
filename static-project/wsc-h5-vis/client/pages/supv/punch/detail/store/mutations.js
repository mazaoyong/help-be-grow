import {
  UPDATE_GCI_NAME,
  UPDATE_TASK_NAME,
  UPDATE_DIARY_ID,
  UPDATE_USERINFO,
  UPDATE_LIKED,
  UPDATE_DIARY,
  UPDATE_LIKE_LIST,
  UPDATE_LIKE_TOTAL,
  UPDATE_TEACHER_COMMENTS,
  UPDATE_TEACHER_COMMENTS_TOTAL,
  UPDATE_STU_COMMENTS,
  UPDATE_STU_COMMENTS_TOTAL,
} from './mutation-types';

export default {
  [UPDATE_GCI_NAME](state, gciName) {
    state.gciName = gciName;
  },

  [UPDATE_TASK_NAME](state, taskName) {
    state.taskName = taskName;
  },

  [UPDATE_DIARY_ID](state, newId) {
    state.diaryId = newId;
  },

  [UPDATE_USERINFO](state, newUserInfo) {
    state.userInfo = newUserInfo;
  },

  [UPDATE_LIKED](state, newLiked) {
    state.liked = newLiked;
  },

  [UPDATE_DIARY](state, newDiary) {
    state.diary = newDiary;
  },

  [UPDATE_LIKE_LIST](state, likeList) {
    state.likeList = likeList.map(item => {
      item.nickname = item.nickName;
      return item;
    });
  },

  [UPDATE_LIKE_TOTAL](state, likeTotal) {
    state.likeTotal = likeTotal;
  },

  [UPDATE_TEACHER_COMMENTS](state, teacherComments) {
    state.teacherComments = teacherComments;
  },

  [UPDATE_TEACHER_COMMENTS_TOTAL](state, teacherCommentsTotal) {
    state.teacherCommentsTotal = teacherCommentsTotal;
  },

  [UPDATE_STU_COMMENTS](state, stuComments) {
    state.stuComments = stuComments;
  },

  [UPDATE_STU_COMMENTS_TOTAL](state, stuCommentsTotal) {
    state.stuCommentsTotal = stuCommentsTotal;
  },
};
