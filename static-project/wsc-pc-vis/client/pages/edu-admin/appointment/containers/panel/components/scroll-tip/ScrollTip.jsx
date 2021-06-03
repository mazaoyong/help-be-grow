import React, { Component } from 'react';
import classnames from 'classnames';

export default class ScrollTip extends Component {
  render() {
    const { show } = this.props;
    const tipClass = classnames({
      'scroll-tip': true,
      'scroll-tip-hidden': !show,
    });
    return (
      <div className={tipClass}>
        <span className="scroll-tip__text">滑动查看更多</span>
      </div>
    );
  }
}
