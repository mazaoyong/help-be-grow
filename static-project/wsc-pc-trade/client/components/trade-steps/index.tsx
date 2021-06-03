import React, { Component } from 'react';
import cx from 'classnames';
import './style.scss';

export { default as TradeStepItem } from './TradeStepItem';

interface IProps {
  className: string;
}

class TradeSteps extends Component<IProps> {
  render() {
    const { children, className } = this.props;

    return <div className={cx('trade-steps', className)}>{children}</div>;
  }
}

export default TradeSteps;
