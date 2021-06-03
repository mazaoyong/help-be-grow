import React, { Component } from 'react';
import cx from 'classnames';

export default class CourseTypeTag extends Component {
  render() {
    const { type, component, bordered, className } = this.props;
    const tagClass = cx({
      'course-type-tag': true,
      'course-type-tag__normal': true,
      'course-type-tag__primary': type === 'primary',
      'course-type-tag__trial': type === 'trial',
      'course-type-tag__success': type === 'success',
      'course-type-tag__border': bordered,
      [className]: !!className,
    });

    return <div className={tagClass}>{component}</div>;
  }
}
