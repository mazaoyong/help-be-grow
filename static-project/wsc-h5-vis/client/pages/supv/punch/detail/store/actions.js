import * as SafeLink from '@youzan/safe-link';
import { Toast } from 'vant';
import get from 'lodash/get';

import apis from 'supv/punch/apis';
import {
  UPDATE_GCI_NAME,
  UPDATE_TASK_NAME,
  UPDATE_USERINFO,
  UPDATE_DIARY_ID,
  UPDATE_LIKED,
  UPDATE_DIARY,
  UPDATE_LIKE_LIST,
  UPDATE_LIKE_TOTAL,
  UPDATE_TEACHER_COMMENTS,
  UPDATE_TEACHER_COMMENTS_TOTAL,
  UPDATE_STU_COMMENTS,
  UPDATE_STU_COMMENTS_TOTAL,
} from './mutation-types';

const {
  getDiary,
  getLikeList,
  getTeacherComments,
  getStudentsComments,
  postLike,
  postCancelLike,
  postCommentOnDiary,
  postComment,
} = apis;

export default {
  fetchDiary({ state, commit }) {
    const {
      alias,
      taskId,
      gciId,
      shareFansId,
      shareFansType,
    } = state;

    return getDiary({
      gciId,
      taskId,
      shareFansId,
      shareFansType,
    })
      .then(res => {
        if (res) {
          if (!res.bought) {
            SafeLink.redirect({
              url: `/wscvis/supv/punch/introduction?kdt_id=${_global.kdt_id}&alias=${alias}`,
              kdtId: window._global.kdtId,
            });
            return;
          }

          // 设置标题
          document.title = res.taskName || res.gciName || '打卡详情';

          // 更新 gckName, taskName
          commit(UPDATE_GCI_NAME, res.gciName);
          commit(UPDATE_TASK_NAME, res.taskName);

          // 更新id
          commit(UPDATE_DIARY_ID, res.id);

          // 更新用户信息
          commit(UPDATE_USERINFO, {
            avatarUrl: res.avatar || 'https://img01.yzcdn.cn/public_files/2017/11/09/99e6bdb52bb2ef654383dde3b0324fbe.png?roundPic/radius/!50p',
            nickname: res.nickname || '',
            fansId: res.fansId, // currentFansId
            fansType: res.fansType, // currentFansType
          });

          // 是不是自己的
          // const isMyDiary = res.fansId === res.shareFansId;

          // 展示编辑按钮
          // const showEditBtn = isMyDiary && res.allowStudentEdit;

          // 是否已点赞
          commit(UPDATE_LIKED, !!res.praise);

          // 更新点赞列表
          commit(UPDATE_LIKE_LIST, get(res, 'praises.content', []));
          commit(UPDATE_LIKE_TOTAL, get(res, 'praises.total', 0));

          // 更新老师评论列表
          commit(UPDATE_TEACHER_COMMENTS, get(res, 'teacherComments.content', []));
          commit(UPDATE_TEACHER_COMMENTS_TOTAL, get(res, 'teacherComments.total', 0));

          // 更新学生评论列表
          commit(UPDATE_STU_COMMENTS, get(res, 'stuComments.content', []));
          commit(UPDATE_STU_COMMENTS_TOTAL, get(res, 'stuComments.total', 0));

          // 更新详情
          commit(UPDATE_DIARY, res);
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '获取打卡详情失败');
      });
  },

  /**
   * 获取所有点赞
   * 加载策略是一次性加载完所有分页
   */
  fetchAllLikeList({ state, commit }, refresh = false) {
    const loaded = state.likeList.length;
    const total = state.likeTotal;
    if (!refresh && loaded && loaded >= total) return Promise.resolve(state.likeList);

    const pageSize = 100;
    const needLoadPage = refresh ? 1 : Math.ceil(total / pageSize);
    const requestList = [];
    for (let i = 1; i <= needLoadPage; i++) {
      requestList.push(getLikeList({
        gciId: state.gciId,
        logId: state.diaryId,
        page: i,
        size: pageSize,
      }));
    }

    return Promise.all(requestList)
      .then((res) => {
        const likeList = [].concat(...res.map((list) => list.content));
        commit(UPDATE_LIKE_LIST, likeList);
        commit(UPDATE_LIKE_TOTAL, likeList.length);
      });
  },

  /**
   * 获取所有老师评论
   * 加载策略是一次性加载完所有分页
   */
  fetchAllTeacherComments({ state, commit }) {
    const loaded = state.teacherComments.length;
    const total = state.teacherCommentsTotal;
    if (loaded && loaded >= total) return Promise.resolve(state.teacherComments);

    const pageSize = 100;
    const needLoadPage = Math.ceil(total / pageSize);
    const requestList = [];
    for (let i = 1; i <= needLoadPage; i++) {
      requestList.push(getTeacherComments({
        gciLogId: state.diaryId,
        taskId: state.taskId,
        page: i,
        size: pageSize,
      }));
    }

    return Promise.all(requestList)
      .then((res) => {
        const teacherComments = [].concat(...res.map((list) => list.content));
        commit(UPDATE_TEACHER_COMMENTS, teacherComments);
      })
      .catch((errMsg) => {
        Toast(errMsg || '获取老师评论失败');
      });
  },

  /**
   * 获取所有学员评论
   * 加载策略是一次性加载完所有分页
   */
  fetchAllStudentComments({ state, commit }, refresh = false) {
    const loaded = state.stuComments.length;
    const total = state.stuCommentsTotal;
    if (!refresh && loaded && loaded >= state.stuCommentsTotal) return Promise.resolve(state.stuComments);

    const pageSize = 100;
    const needLoadPage = refresh ? 1 : Math.ceil(total / pageSize);
    const requestList = [];
    for (let i = 1; i <= needLoadPage; i++) {
      requestList.push(getStudentsComments({
        gciLogId: state.diaryId,
        taskId: state.taskId,
        page: i,
        size: pageSize,
      }));
    }

    return Promise.all(requestList)
      .then((res) => {
        const studentsComments = [].concat(...res.map((list) => list.content));
        commit(UPDATE_STU_COMMENTS, studentsComments);
        commit(UPDATE_STU_COMMENTS_TOTAL, studentsComments.length);
      })
      .catch((errMsg) => {
        Toast(errMsg || '获取学员评论失败');
      });
  },

  postLike({ state, dispatch }) {
    (state.liked ? postLike : postCancelLike)({
      gciLogId: state.diaryId,
    })
      .then(res => {
        if (res) {
          dispatch('fetchAllLikeList', true);
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '更新点赞状态失败');
      });
  },

  postCommentOnDiary({ state, dispatch }, { content }) {
    postCommentOnDiary({
      commentUserType: 1,
      comment: content,
      gciLogId: state.diaryId,
    })
      .then(res => {
        if (res) {
          dispatch('fetchAllStudentComments', true);
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '评论失败');
      });
  },

  postComment({ state, dispatch }, { content, commentId = '' }) {
    postComment({
      commentUserType: 1,
      comment: content,
      gciLogId: state.diaryId,
      commentId,
    })
      .then(res => {
        if (res) {
          dispatch('fetchAllStudentComments', true);
        }
      })
      .catch(errMsg => {
        Toast(errMsg || '评论失败');
      });
  },
};
