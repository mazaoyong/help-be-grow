import React, { Component } from 'react';

export default class CreateTip extends Component {
  render() {
    const { x = 100, y = 100 } = this.props;
    return (
      <div className="create-tip" style={{ left: x + 'px', top: y + 'px' }}>
        <div className="create-tip__content">点击新建预约</div>
        <i className="create-tip__icon-arrow" />
      </div>
    );
  }
}
