import { Pop } from '@zent/compat';
/* eslint-disable camelcase */
import React from 'react';
import { format } from 'date-fns';

const CommentReply = props => {
  const deleteComment = () => {
    const { id } = props.data;
    props.deleteComment({
      id,
    });
  };

  const { productComment, createAt } = props.data;
  const time = format(createAt, 'YYYY-MM-DD HH:mm:ss');
  return (
    <div className="comment-content-reply">
      <div className="comment-content-reply__info">
        <span className="comment-content-reply__info__author">你的回复</span>
        <span className="comment-content-reply__info__time">{time}</span>
        <Pop
          trigger="click"
          content="确定删除该留言吗？"
          confirmText="确定"
          cancelText="取消"
          position="bottom-right"
          onConfirm={deleteComment}
          centerArrow
        >
          <span className="comment-content-reply__info__delete">删除</span>
        </Pop>
      </div>
      <div className="comment-content-reply__text">{productComment}</div>
    </div>
  );
};

export default CommentReply;
