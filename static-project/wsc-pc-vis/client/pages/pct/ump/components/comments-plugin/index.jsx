import React, { Component } from 'react';

import API from '../../../tabs/api';
import './style.scss';

const { getCommentCount } = API;

export default class CommentPlugin extends Component {
  state = {
    counts: null,
  };

  componentDidMount() {
    this.getCommentCount();
  }

  getCommentCount() {
    getCommentCount().then(data => {
      this.setState({ counts: data });
    });
  }

  render() {
    const { counts } = this.state;
    const isOver99 = counts > 99;
    const countStayle = `application-counts${isOver99 ? '' : ' application-counts-single'}`;

    if (counts > 0) {
      return <span className={countStayle}>{isOver99 ? '99+' : counts}</span>;
    }
    return null;
  }
}
