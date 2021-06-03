
import { MonthPicker, Form } from '@zent/compat';
import React, { Component } from 'react';
import omit from 'lodash/omit';

const { getControlGroup, unknownProps } = Form;

class EduCourseDate extends Component {
  render() {
    const { extraComponent, ...rest } = this.props;
    const passableProps = omit(rest, unknownProps);

    return (
      <div className="edu-course-date-wrap">
        <MonthPicker {...passableProps} />
        {!!extraComponent && extraComponent}
      </div>
    );
  }
}

const EduCourseDateField = getControlGroup(EduCourseDate);

export default EduCourseDateField;
