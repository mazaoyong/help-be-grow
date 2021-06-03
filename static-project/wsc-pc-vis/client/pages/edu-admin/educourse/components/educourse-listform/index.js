import React, { PureComponent, Component } from 'react';
import EduCourseTable from '../educourse-table';

export default class EduCourseForm extends (PureComponent || Component) {
  render() {
    const { onEduCourseEdit, route, isRiskLock } = this.props;
    return (
      <div className="educourse-list-form">
        <EduCourseTable {...{ onEduCourseEdit, route, isRiskLock }} />
      </div>
    );
  }
}
