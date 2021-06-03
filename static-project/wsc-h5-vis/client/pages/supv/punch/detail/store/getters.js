export default {
  commentList(state) {
    const {
      teacherComments,
      stuComments,
    } = state;
    return teacherComments.map(comment => ({
      publisher: '老师',
      commentId: comment.commentId,
      content: comment.comment,
      receiver: comment.parentNickname,
    })).concat(stuComments.map(comment => ({
      publisher: comment.nickname,
      publisherId: comment.fansId,
      commentId: comment.commentId,
      content: comment.comment,
      receiver: comment.parentNickname,
      receiverId: comment.parentFansId,
    })));
  },

  isMine(state) {
    return state.diary.shareFansId && state.diary.shareFansId === state.diary.fansId;
  },

  allowEdit(state, getters) {
    return getters.isMine && state.diary.allowStudentEdit;
  },
};
