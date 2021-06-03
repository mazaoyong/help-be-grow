import React, { PureComponent, Component } from 'react';
import cx from 'classnames';

export default class ReactPreview extends (PureComponent || Component) {
  render() {
    const { className, children } = this.props;

    return <div className={cx('rc-design-react-preview', className)}>{children}</div>;
  }
}
