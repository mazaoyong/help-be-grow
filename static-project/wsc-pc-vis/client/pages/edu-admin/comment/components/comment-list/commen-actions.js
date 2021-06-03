import { setCommentStatus, deleteComment, addComment } from '../../api';
import { Notify } from 'zent';

const actions = {
  toggleStatus: payload => {
    const { id, isSticky, isChosen, contentId, isHide, kdtId } = payload;
    return setCommentStatus({
      id,
      isSticky,
      isChosen,
      contentId,
      isHide,
      kdtId
    });
  },
  deleteComment: payload => {
    const { id, contentId, kdtId } = payload;
    return deleteComment({ id, contentId, kdtId });
  },
  addComment: payload => {
    const { id, alias, comment, contentId, userId, subKdtId } = payload;
    return addComment({
      productComment: comment,
      toCommentId: id,
      toUserId: userId,
      contentId,
      alias,
      subKdtId,
    }).catch(msg => Notify.error(msg));
  }
};

const CommentActionAdapter = (type, payload) => {
  const caller = actions[type];
  if (caller) {
    return caller(payload);
  }
};

export default CommentActionAdapter;
