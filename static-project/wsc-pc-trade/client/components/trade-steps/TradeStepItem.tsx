import React, { Component } from 'react';
import cx from 'classnames';

interface IProps {
  header: JSX.Element;
  content: JSX.Element;
  className?: string;
}

export default class TradeStepItem extends Component<IProps> {
  render() {
    const { header, content, className = '' } = this.props;

    return (
      <div className={cx('trade-step-item', className)}>
        <div className="trade-step-tail">
          <i />
        </div>
        <div className="trade-step-content">
          <div className="trade-step-head">{header}</div>
          <div className="trade-step-main">{content}</div>
        </div>
      </div>
    );
  }
}
