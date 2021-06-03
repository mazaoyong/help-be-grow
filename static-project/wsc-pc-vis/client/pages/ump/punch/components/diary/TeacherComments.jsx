import { Pop } from '@zent/compat';
import React, { Component } from 'react';
import { Pagination, BlockLoading, Notify } from 'zent';

import formatDate from 'zan-utils/date/formatDate';

import { getPunchtTeacherLogsAPI, deletePunchLogsAPI } from '../../api';

export default class TeacherComments extends Component {
  state = {
    // 第一个评论的 commentId
    prevTotal: this.props.data.total || 0,
    loading: false,
    pageNumber: 1,
    total: this.props.data.total || 0,
    content: this.props.data.content || [],
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.prevTotal !== nextProps.data.total) {
      return {
        prevTotal: nextProps.data.total,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.prevTotal !== prevProps.data.total) {
      this.getTeacherComments();
    }
  }

  getTeacherComments = current => {
    this.setState({
      loading: true,
    });

    const res = {
      page: current || this.state.pageNumber,
      size: 10,
      taskId: this.props.taskId,
      gciLogId: this.props.id,
      fansId: window._global.userId,
    };

    getPunchtTeacherLogsAPI(res)
      .then(({ content = [], total, pageable: { pageNumber = 1 } }) => {
        this.setState({
          content,
          total,
          pageNumber: pageNumber,
        });
      })
      .catch(msg => {
        Notify.error(msg || '获取评论失败！');
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  };

  deleteLogs(commentId) {
    this.setState({
      loading: true,
    });

    const req = {
      commentId,
      gciLogId: this.props.id,
      fansId: window._global.userId,
      operationType: 1,
    };

    deletePunchLogsAPI(req)
      .then(() => {
        Notify.success('删除成功！');
        this.getTeacherComments();
      })
      .catch(msg => {
        Notify.error(msg || '删除失败！');
        this.setState({
          loading: false,
        });
      });
  }

  renderItem = one => {
    return (
      <div className="teacher-comments__list__item" key={one.commentId}>
        <div className="item-head">
          <h4 className="item-head__title">老师点评</h4>
          <span className="item-head__date">
            {formatDate(one.commentAt, 'YYYY-MM-DD HH:mm:ss')}
          </span>
          <div className="operate">
            <Pop
              trigger="click"
              position="left-top"
              content={'确定删除此点评？'}
              onConfirm={() => this.deleteLogs(one.commentId)}
            >
              <span className="ui-link--split">删除</span>
            </Pop>
          </div>
        </div>
        <div className="item-content">
          <p className="item-content__text">{one.comment}</p>
        </div>
      </div>
    );
  };

  render() {
    const { content, total, pageNumber } = this.state;

    return (
      <BlockLoading loading={this.state.loading}>
        <div className="teacher-comments">
          <div className="teacher-comments__list">{content.map(one => this.renderItem(one))}</div>
          {total > 10 && (
            <Pagination
              current={pageNumber}
              totalItem={total}
              onChange={({ current }) => this.getTeacherComments(current)}
            />
          )}
        </div>
      </BlockLoading>
    );
  }
}
