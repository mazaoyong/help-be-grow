
import { Form } from '@zent/compat';
import React, { PureComponent, Component } from 'react';
import cx from 'classnames';
import EduCourseSelector from './component';

const { Field } = Form;

export default class EduCourseSelectorWrap extends (PureComponent || Component) {
  getRequiredValidation = () => {
    const { courseType, applyCourseType } = this.props;
    let validations = {};
    if (courseType !== 0 && applyCourseType !== 1) {
      validations['required'] = (formatValue, value) => {
        if (!value.id) {
          return '请选择关联课程';
        }
        return true;
      };
    }
    return validations;
  };

  render() {
    const { eduCourse, ...props } = this.props;
    return (
      <Field
        {...props}
        component={EduCourseSelector}
        name="eduCourse"
        value={eduCourse}
        onChange={this.onEduCourseChange}
        required
        validations={this.getRequiredValidation()}
        className={cx([
          'educourse-field',
          {
            hide: props.courseType === 0 || (props.applyCourseType === 1 && props.courseSellType !== 3),
          },
        ])}
      />
    );
  }
}
