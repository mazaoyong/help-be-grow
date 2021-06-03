import React from 'react';
import GoodsList from '../../components/goods-list';
import CommentList from '../../components/comment-list';
import './style.scss';

export default () => (
  <div className="comment-container">
    <GoodsList />
    <CommentList />
  </div>
);
