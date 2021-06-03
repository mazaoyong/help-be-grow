// 营销 tab 留言管理小红点提醒
import React, { Component } from 'react';
import API from '../../api';

export default class CommentNotify extends Component {
  state = {
    count: 0,
  };

  componentDidMount() {
    this.getCommentCount();
  }

  getCommentCount() {
    API.getCommentCount().then(data => {
      this.setState({
        count: data,
      });
    });
  }

  render() {
    const { count } = this.state;

    return (
      <span className={count > 0 ? 'ump-tabname-dot' : null}>营销</span>
    );
  }
}
