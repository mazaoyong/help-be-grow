
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import component from './component';

const { Field } = Form;

export default class Teacher extends Component {
  render() {
    const {
      label,
      teacherList,
      applyCourse,
      courseType,
      desc,
      queryStaff = false,
      showOnlyScheduledFilter = true,
    } = this.props;

    return (
      <Field
        name="teacherList"
        label={label}
        component={component}
        value={teacherList}
        applyCourse={applyCourse}
        courseType={courseType}
        desc={desc}
        queryStaff={queryStaff}
        showOnlyScheduledFilter={showOnlyScheduledFilter}
        maxTeacherNum={20}
      />
    );
  }
}
