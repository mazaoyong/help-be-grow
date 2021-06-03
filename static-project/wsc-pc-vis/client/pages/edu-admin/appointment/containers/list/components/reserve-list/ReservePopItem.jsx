import { Pop } from '@zent/compat';
import React, { Component } from 'react';

export default class ReservePopItem extends Component {
  render() {
    const { content, children } = this.props;
    return (
      <Pop className="reserve-pop-item" position="top-left" trigger="hover" content={content}>
        {children || content}
      </Pop>
    );
  }
}
