
import { Form } from '@zent/compat';
import React, { Component } from 'react';
import component from './CourseGroupFieldComp';
import './CourseGroupField.scss';
const { Field } = Form;

export default class CourseGroupField extends Component {
  render() {
    const { label, groups, groupList } = this.props;
    return (
      <Field
        name="groups"
        label={label}
        component={component}
        value={groups || []}
        // 用于渲染选中的选项
        groups={groupList || []}
        className="course-group-field"
      />
    );
  }
}
