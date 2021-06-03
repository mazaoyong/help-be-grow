import React, { Component } from 'react';
import cx from 'classnames';

export default class EduClassStatusTag extends Component {
  render() {
    const { type, children, bordered, className } = this.props;
    const tagClass = cx({
      'class-status-tag': true,
      'class-status-tag__normal': true,
      'class-status-tag__primary': type === 'primary',
      'class-status-tag__success': type === 'success',
      'class-status-tag__border': bordered,
      [className]: !!className,
    });

    return <div className={tagClass}>{children}</div>;
  }
}
